import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY_META, ROLE_KEY_META } from '@common/constant'

type Role = 'admin' | 'user'

export const SetRole = (role: Role[]) => SetMetadata(ROLE_KEY_META, role)
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY_META, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    const roles = this.reflector.get<string[]>(ROLE_KEY_META, context.getHandler())
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const { role } = request.user
    if (!roles.includes(role)) {
      throw new Error('当前用户没有访问权限')
    }
    return true
  }
}
