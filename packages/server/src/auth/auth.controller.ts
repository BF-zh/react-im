import { Buffer } from 'node:buffer'
import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Res } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
@ApiTags('身份校验')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Get('qr')
  //  二维码内容
  @ApiOperation({ summary: '登录', description: '通过QQ扫码登录', responses: {} })
  async QRCode(@Res({ passthrough: true }) res: Response) {
    const { qrsig, qr } = await this.auth.generateQrCode()
    const base64 = `data:image/png;base64,${Buffer.from(qr).toString('base64')}`
    res.cookie('qrsig', qrsig)
    return { qrsig, base64 }
  }

  @Get('qrpic')
  async QRCodePic(@Res() res: Response) {
    const { qrsig, qr } = await this.auth.generateQrCode()
    res.type('image/png')
    res.cookie('qrsig', qrsig)
    res.send(qr)
  }

  @Get('check')
  checkQRCode(@Headers('Cookie') cookie: string) {
    return this.auth.checkQrCode(cookie)
  }
}
