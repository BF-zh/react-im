import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from './auth.guard'

type Role = 'admin' | 'user'
const ROLE_KEY = 'roles'
export const SetRole = (role: Role[]) => SetMetadata(ROLE_KEY, role)
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    const roles = this.reflector.get<string[]>(ROLE_KEY, context.getHandler())
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const { role } = request.user
    if (!roles.includes(role)) {
      throw new Error('Forbidden')
    }
    return true
  }
}
