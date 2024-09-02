import { Buffer } from 'node:buffer'
import { Test, TestingModule } from '@nestjs/testing'
import { UserModule } from '../user/user.module'
import { AuthService } from './auth.service'

describe('authService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [AuthService],
    }).compile()
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // TODO: Add more tests
  it('生成验证码', async () => {
    const a = await service.GET_QQ_QR()
    expect(a).toMatchObject({
      qr: expect.any(Buffer),
      qrsig: expect.any(String),
    })
  })
  it('验证二维码', async () => {
    const a = await service.GET_WX_State('qrsig=59c419a50619a99dd994ab0bef92b20fe4cb8a2b281c043325156cd33ddea0db0c99d60febb1e44b8f4e051755d5e38c1266dd0fccd4057e048ba87db639b953')
    expect(a).toMatchObject({
      code: 65,
      msg: '二维码已失效',
    })
  })
})
