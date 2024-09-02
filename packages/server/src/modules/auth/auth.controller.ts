import { Buffer } from 'node:buffer'
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Res } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation, ApiResetContentResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { UserService } from 'src/modules/user/user.service'
import { PublicApi } from '../../guards/auth.guard'
import { Cookies } from '../../utils'
import { AuthService } from './auth.service'

const { parse } = Cookies()
@Controller('auth')
@ApiTags('身份校验')
@PublicApi()
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly user: UserService) { }

  //  二维码内容
  @ApiOperation({ summary: '获取QQ登录二维码', description: '得到base64编码的二维码图片' })
  @ApiOkResponse({
    status: 200,
    description: '二维码内容',
    example: {
      data: {
        cookie: 'pt_user_id=15457445690186731530; pt_login_sig=rICQ1qFGJIx6uInSPbMLqANhj89EcrSYmGKZukJWo7l7pdCjBy2nR7Yqx*9D8ZKZ; pt_clientip=6a9db697bd125452; pt_serverip=be847f000001a7d1; pt_local_token=-2027108047; uikey=f5e02df9c799ed91b5ca45c8c4eea10ec88dece1445f91d832200c578551fd6d; pt_guid_sig=d234e95d2ff9ff3254f7a5517453480765a95c829b97ee6bf92f0528894b5643; ptui_identifier=000E010EA9C0B9E103BA442F4DB292FA7ABD7FBF5EC61A65BB8F464B73;qrsig=8ae407e9bba080e2eb92d29ad76c432eb21cdc939250898e0e28db30ebac617e935e06b9225ed1e3e517ef761b4bbf03bd02318a0481d2e505cf8cd58f0fc5b7',
        base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABvAQAAAADKvqPNAAAACXBIWXMAAAsTAAALEwEAmpwYAAABc0lEQVQ4jbXVQW6DMBAF0EEsvIMLWPI1vPOV4AI4XIBcyTtfwxIXgJ0XFtMPTap2UQ+LNooiXqR4Zjz2hPjHi/6QhUiPUU8uDUReomfd2dLnNHIROShzqDKy2YO+Qd1ksyg93qJ5KLNRukPPZrN6oPJOssbPevH+Xv4vxPaVPpaG1/fGVlgG286h3WwZc/ICeQ+pc2midc4kcnPaBwQiQjkSF5v6wHvkh11ZIPLXk1ofjp+ZJTIHRv44KtO1VJUokyZHndX+WqrOJiMrbJE5rJHIc9adwyc1kSUiEC+O90xjOLtfpw94oD5rH8+4VfKiio/62iKWWMjqEQ1y62JbkThUHeGEX50ViKPSztlwbg+bRD4zzhUS42c4k6wSDzTG9VBE6rplNZ53gVQiRAkrCzxvWc8a32AFkZg5RJhOiNiKxGTYQ5nOrMwN6g4DCq3PrxFU53DeHfOwr99WiJkzR5RAaJaXiHo7wmRov8b17/y3v4kPUhCI4YbJgbEAAAAASUVORK5CYII=',
      },
      code: 200,
      message: '请求成功',
    },
  })
  @Get('qq/qr')
  async QRCode(@Res({ passthrough: true }) res: Response) {
    const { cookie, qr } = await this.auth.GET_QQ_QR()
    Object.entries(parse(cookie)).forEach(([key, value]) => {
      res.cookie(key, value)
    })
    const base64 = `data:image/png;base64,${Buffer.from(qr).toString('base64')}`
    return { cookie, base64 }
  }

  @Get('qq/qrpic')
  async QRCodePic(@Res() res: Response) {
    const { cookie, qr } = await this.auth.GET_QQ_QR()
    Object.entries(parse(cookie)).forEach(([key, value]) => {
      res.cookie(key, value)
    })
    res.type('image/png')

    res.send(qr)
  }

  @Get('qq/state')
  checkQRCode(@Headers('Cookie') cookie: string) {
    return this.auth.GET_QQ_State(cookie)
  }

  @Get('wx/qr')
  async WXQRCode(@Res({ passthrough: true }) res: Response) {
    const { qr, uuid } = await this.auth.GET_WX_QR()
    const base64 = `data:image/png;base64,${Buffer.from(qr).toString('base64')}`
    res.cookie('uuid', uuid)
    return { uuid, base64 }
  }

  @Get('wx/qrpic')
  async WXQRCodePic(@Res() res: Response) {
    const { qr, uuid } = await this.auth.GET_WX_QR()
    res.type('image/png')
    res.cookie('uuid', uuid)
    res.send(qr)
  }

  @Get('wx/state')
  checkWXQRCode(@Headers('Cookie') cookie: string) {
    return this.auth.GET_WX_State(cookie)
  }
}
