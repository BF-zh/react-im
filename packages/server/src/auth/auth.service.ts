import { Buffer } from 'node:buffer'
import { Injectable } from '@nestjs/common'
import axios from 'axios'
import * as Cookie from 'cookie'
import { UserService } from '../user/user.service'

export interface Code {
  qrsig: string
  qr: ArrayBuffer
}

@Injectable()
export class AuthService {
  constructor(private readonly UServer: UserService) { };

  /**
   * 生成二维码
   */
  async generateQrCode(): Promise<Code> {
    const qrData = await axios.get(`https://ssl.ptlogin2.qq.com/ptqrshow?appid=549000912&e=2&l=M&s=3&d=72&v=4&t=0.3256${Date.now()}&daid=5&pt_3rd_aid=0&u1=https://qzs.qzone.qq.com/qzone/v5/loginsucc.html?para=izone`, {
      responseType: 'arraybuffer',
    })
    const qr = qrData.data as ArrayBuffer
    const { qrsig } = Cookie.parse(qrData.headers['set-cookie'].join(';'))
    return { qr, qrsig }
  }

  /**
   * 检查二维码
   */
  async checkQrCode(cookie: string) {
    if (!cookie)
      return { code: 400, msg: '参数错误' }
    const qrsig = cookie.split(';').find(item => item.includes('qrsig'))?.split('=')[1]
    if (!qrsig)
      return { code: 400, msg: '参数错误' }
    const url = `https://ssl.ptlogin2.qq.com/ptqrlogin?u1=https://qzs.qzone.qq.com/qzone/v5/loginsucc.html?para=izone&ptqrtoken=${this.ptqrtoken(qrsig)}&ptredirect=0&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=0-0-1724915478267&js_ver=24081515&js_type=1&pt_uistyle=40&aid=549000912&daid=5&&o1vId=0c75e85d6840c8060ec5a7f86e2604bb&pt_js_version=v1.55.2`
    const { headers, data } = await axios.get(url, {
      headers: {
        'Host': 'ssl.ptlogin2.qq.com',
        'Cookie': `qrsig=${qrsig}`,
        'Referer': 'https://xui.ptlogin2.qq.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62',
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
    console.log(code, code === 0, '------------status-------------')
    if (code === 0) {
      const { uin, skey, superuin, supertoken, superkey, pt_recent_uins, RK, ptcz } = Cookie.parse(headers['set-cookie'].join(';'))
      return { code, msg: codeMap[code], uin, skey, superuin, supertoken, superkey, pt_recent_uins, RK, ptcz }
    }
    return { code, msg: codeMap[code] }
  }

  private ptqrtoken(t: string) {
    let e = 0
    for (const char of t) {
      e += (e << 5) + char.charCodeAt(0)
    }
    return 2147483647 & e
  }
}
