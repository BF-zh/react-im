import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as Cookie from 'cookie'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'
import { UserService } from '../user/user.service'
import { Cookies } from '../../utils'
import { CreateUserDto } from '../user/dto/create-user.dto'
import type { IMuiscUser } from './auth.userinfo.dto'

export interface Code {
  qr: ArrayBuffer
  cookie: string
}

const User_Agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
const { parse, format } = Cookies()
@Injectable()
export class AuthService {
  constructor(private readonly UServer: UserService, private JWT: JwtService, private confg: ConfigService) { };
  /**
   * 生成ptk
   * @param t skey
   * @return  ptk
   */
  private QQ_ptk(t: string) {
    let hash = 0
    for (const char of t) {
      hash += (hash << 5) + char.charCodeAt(0)
    }
    return 2147483647 & hash
  }

  /**
   * 生成bkn
   * @param t p_skey
   * @return bkn
   */
  private QQ_bkn(t: string) {
    let hash = 5381
    for (const char of t) {
      hash += (hash << 5) + char.charCodeAt(0)
    }
    return 2147483647 & hash
  }

  /**
   * 生成QQ二维码
   * @returns 二维码和cookie
   */
  async GET_QQ_QR(): Promise<Code> {
    const cookie_1 = await axios.get(`https://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=716027609&daid=383&style=33&hide_title_bar=1&hide_border=1&target=self&s_url=https://graph.qq.com/oauth2.0/login_jump&pt_3rd_aid=100497308&pt_feedback_link=https://support.qq.com/products/77942?customInfo=.appid100497308&theme=2&verify_theme=`).then(({ headers }) => format(headers['set-cookie'].join(';')))
    const qrData = await axios.get(`https://ssl.ptlogin2.qq.com/ptqrshow?appid=716027609&e=2&l=M&s=3&d=72&v=4&t=0.${Date.now()}&daid=383&pt_3rd_aid=100497308&u1=https://graph.qq.com/oauth2.0/login_jump`, {
      responseType: 'arraybuffer',
    })
    const qr = qrData.data as ArrayBuffer
    const cookie_2 = format(qrData.headers['set-cookie'].join(';'))
    const cookie = `${cookie_1};${cookie_2}`
    return { qr, cookie }
  }

  /**
   * 检查QQ二维码状态
   * @param cookie 二维码cookie
   * @returns 0: 登录成功, 65: 二维码已失效, 66: 等待扫码, 67: 正在验证二维码
   */
  async GET_QQ_State(cookie: string) {
    if (!cookie)
      throw new Error('参数错误')
    const { qrsig, pt_login_sig } = parse(cookie)
    if (!qrsig)
      throw new Error('参数错误')
    const url = `https://ssl.ptlogin2.qq.com/ptqrlogin?u1=https://graph.qq.com/oauth2.0/login_jump&ptqrtoken=${this.QQ_ptk(qrsig)}&ptredirect=0&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=0-0-${Date.now()}&js_ver=24081515&js_type=1&login_sig=${pt_login_sig}&pt_uistyle=40&aid=716027609&daid=383&pt_3rd_aid=100497308&&o1vId=38ea70b3ebfae599668f392d7c29cef0&pt_js_version=v1.55.2`
    const { data } = await axios.get(url, {
      headers: {
        'Host': 'ssl.ptlogin2.qq.com',
        'Cookie': cookie,
        'Referer': 'https://xui.ptlogin2.qq.com',
        'User-Agent': User_Agent,
      },
    })
    const status = data.match(/ptuiCB\('(.*)',/)[1].replace(/'/g, '').split(',').filter(Boolean)
    const code = Number(status[0])
    const codeMap = {
      0: '登录成功',
      65: '二维码已失效',
      66: '等待扫码',
      67: '正在验证二维码',
    }
    if (code)
      return { code, msg: codeMap[code] }
    const [, , ourl] = status
    const _url = ourl.replace('nodirect=0', 'nodirect=1')
    const headers = await axios.get(_url).then(({ headers }) => headers)
    const O_cookie = format(headers['set-cookie']?.join(';') || '')
    const cookies = await this.GET_QQ_Cookie(O_cookie)
    const token = await this.GET_Token(cookies)
    return { code, token }
  }

  /**
   * 获取查询用户信息必须的 cookie
   * @param cookie 二维码cookie
   * @returns cookie
   */
  private async GET_QQ_Cookie(cookie: string) {
    const code = await this.GET_QQ_Code(cookie)
    const { headers } = await axios.request({
      method: 'post',
      url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'referer': 'https://y.qq.com/',
        'User-Agent': User_Agent,
        'Origin': 'y.qq.com',
        'Cookie': cookie,
        'priority': 'u=1, i',
      },
      data: JSON.stringify({
        comm: {
          g_tk: 5381,
          platform: 'yqq',
          ct: 24,
          cv: 0,
        },
        req: {
          module: 'QQConnectLogin.LoginServer',
          method: 'QQLogin',
          param: { code },
        },
        maximumAge: 0,
      }),
    })
    const cookie_1 = format(headers['set-cookie']?.join(';') || '')
    return `${cookie};${cookie_1}`
  }

  /**
   * 获取 authorize CODE
   * @param cookie qq cookie
   * @returns QQ CODE 码
   */
  private async GET_QQ_Code(cookie: string) {
    const { p_skey } = parse(cookie)
    if (!p_skey)
      throw new Error('cookie 无效')
    const { headers } = await axios.request({
      url: 'https://graph.qq.com/oauth2.0/authorize',
      method: 'POST',
      data: {
        response_type: 'code',
        client_id: '100497308',
        redirect_uri: 'https://y.qq.com/portal/wx_redirect.html?login_type=1&surl=https://y.qq.com/#&use_customer_cb=0',
        scope: 'get_user_info,get_app_friends',
        state: 'state',
        switch: '',
        from_ptlogin: '1',
        src: '1',
        update_auth: '1',
        openapi: '1010_1030',
        g_tk: this.QQ_bkn(p_skey),
        auth_time: Date.now(),
        ui: uuidv4(),
      },
      headers: {
        'Referer': `"https://graph.qq.com/oauth2.0/show?which=Login&display=pc&response_type=code&client_id=100497308&redirect_uri=https://y.qq.com/portal/wx_redirect.html?login_type=1&surl=https://y.qq.com/portal/profile.html#stat=y_new.top.user_pic&stat=y_new.top.pop.logout&use_customer_cb=0&state=state&display=pc`,
        'User-Agent': User_Agent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie,
      },
      maxRedirects: 0,
      validateStatus(status) {
        return status < 400
      },
    })
    const { location } = headers
    const [, code] = location.match(/code=(.+)&/) || []
    if (!code)
      throw new Error('登录成功，但获取信息失败')
    return code
  }

  /**
   * 生成微信二维码
   * @returns 二维码
   */
  async GET_WX_QR() {
    const url = `https://open.weixin.qq.com/connect/qrconnect?appid=wx48db31d50e334801&redirect_uri=https://y.qq.com/portal/wx_redirect.html?login_type=2&surl=https://y.qq.com/&response_type=code&scope=snsapi_login&state=STATE&href=https://y.qq.com/mediastyle/music_v17/src/css/popup_wechat.css#wechat_redirect`
    const { data } = await axios.get(url, {
      responseType: 'document',
      headers: {
        'Referrer': 'https://y.qq.com/',
        'User-Agent': User_Agent,
      },
    })
    const uuid = data.match(/uuid=(.+)"/)[1]
    const { data: qr } = await axios.get(`https://open.weixin.qq.com/connect/qrcode/${uuid}`, {
      headers: {
        'Referrer': url,
        'User-Agent': User_Agent,
      },
      responseType: 'arraybuffer',
    })
    return { uuid, qr }
  }

  /**
   * 检查微信二维码状态
   * @param cookie wx cookie
   * @returns token
   * - status 状态码
   * - msg 状态信息
   * - token token
   * @402 二维码已失效
   * @403 已取消扫码
   * @404 正在验证二维码
   * @408 等待扫码
   */
  async GET_WX_State(cookie: string) {
    const { uuid } = Cookie.parse(cookie)
    const url = `https://lp.open.weixin.qq.com/connect/l/qrconnect?uuid=${uuid}&_=${Date.now()}`
    const { data } = await axios.get(url, {
      headers: {
        'Referrer': 'https://y.qq.com/',
        'User-Agent': User_Agent,
      },
    })
    const [status, code] = data.match(/='(.*)'|=(\d+)/g).map(item => item.replace(/'|=/g, '')).filter(Boolean)
    const statusMap = {
      402: '二维码已失效',
      403: '已取消扫码',
      404: '正在验证二维码',
      408: '等待扫码',
    }
    if (!code)
      return { status: Number(status), msg: statusMap[status] }
    const cookies = await this.GET_WX_Cookies(code)
    const token = await this.GET_Token(cookies)
    return { token, code }
  }

  /**
   * 获取微信cookie
   * @param code 微信code
   * @returns 微信cookie
   */
  private async GET_WX_Cookies(code: string) {
    return axios.request({
      url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
      method: 'post',
      data: JSON.stringify({
        comm: {
          tmeAppID: 'qqmusic',
          tmeLoginType: '1',
          g_tk: 5381,
          platform: 'yqq',
          ct: 24,
          cv: 0,
        },
        req: {
          module: 'music.login.LoginServer',
          method: 'Login',
          param: { strAppid: 'wx48db31d50e334801', code },
        },
      }),
      headers: {
        'Origin': 'https://y.qq.com',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://y.qq.com/',
        'User-Agent': User_Agent,
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Priority': 'u=1,i',
      },
    }).then(({ headers }) => format(headers['set-cookie'].join(';')))
  }

  /**
   * 用户信息
   * @param cookie 微信 或者 QQ cookie
   * @returns 用户信息
   * @deprecated
   */
  private async GET_User(cookie: string) {
    const { qqmusic_key, p_skey, p_uin } = parse(cookie)
    const uin = p_uin?.replace('o', '')
    const g_tk = this.QQ_bkn(qqmusic_key ?? p_skey)
    const url = `https://c6.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg?_=${Date.now()}&cv=4747474&ct=20&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=1&uin=${uin}&g_tk_new_20200303=${g_tk}&g_tk=${g_tk}&cid=205360838&userid=0&reqfrom=1&reqtype=0`
    const { data: res } = await axios.get(url, {
      headers: {
        'Referrer': 'https://y.qq.com/',
        'User-Agent': User_Agent,
        'Cookie': `${cookie}; qm_keyst=${qqmusic_key ?? ''};uin=${uin}`,
      },
    })
    if (!res)
      throw new Error('获取用户信息失败')
    const { data } = res
    if (!data)
      throw new Error('获取用户信息失败')
    return data
  }

  /**
   * 获取 用户信息 新
   */
  private async GET_User_New(cookie: string) {
    const { qqmusic_key, p_skey, p_uin, wxuin } = parse(cookie)
    const uin = p_uin?.replace('o', '') || wxuin || ''
    const g_tk = this.QQ_bkn(qqmusic_key ?? p_skey)
    const { data } = await axios.request<IMuiscUser>({
      url: `http://u6.y.qq.com/cgi-bin/musicu.fcg`,
      method: 'POST',
      data: JSON.stringify({
        comm: {
          cv: 4747474,
          ct: 24,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'yqq.json',
          needNewCode: 1,
          uin,
          g_tk_new_20200303: g_tk,
          g_tk,
        },
        User: {
          module: 'userInfo.BaseUserInfoServer',
          method: 'get_user_baseinfo_v2',
          param: { vec_uin: [String(uin)] },
        },
        VIP: {
          module: 'userInfo.VipQueryServer',
          method: 'SRFVipQuery_V2',
          param: { uin_list: [String(uin)] },
        },
      }),
      headers: {
        'User-Agent': User_Agent,
        'Cookie': `${cookie}; qm_keyst=${qqmusic_key ?? ''};uin=${uin}`,
      },
      transformResponse: (data) => {
        const User = JSON.parse(data)?.User?.data?.map_userinfo?.[uin] || {}
        const VIP = JSON.parse(data)?.VIP?.data?.infoMap?.[uin] || {}
        return {
          ...User,
          ...VIP,
        }
      },
    })
    if (!data)
      throw new Error('获取用户信息失败')
    const { detail, ...User } = {
      avatar: data.headurl,
      nickname: data.nick,
      detail: data,
      type: p_uin ? 'qq' : 'wechat',
      username: uin,
    } as CreateUserDto
    await this.UServer.findorCreate({ detail, ...User })
    return User
  }

  async GET_Token(cookie: string) {
    const User = await this.GET_User_New(cookie)
    return this.JWT.sign(User, {
      secret: this.confg.get('JWT_SECRET'),
    })
  }
}
