import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, Type, ValidationError } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    const errorList: string[] = []
    const errObjList: ValidationError[] = [...errors]

    do {
      const e = errObjList.shift()
      if (!e) {
        break
      }
      if (e.constraints) {
        for (const item in e.constraints) {
          errorList.push(e.constraints[item])
        }
      }
      if (e.children) {
        errObjList.push(...e.children)
      }
    } while (true)
    if (errorList.length > 0) {
      throw new HttpException(`请求参数校验错误:${errorList.join()}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return object
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
