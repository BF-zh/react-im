import { existsSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import type { Buffer } from 'node:buffer'
import type { Observable } from 'rxjs'
import { from } from 'rxjs'
import sharp from 'sharp'

export const HelperService = {

  /* The `isDev()` function is checking if the value of the `NODE_ENV` environment variable starts with
the string "dev". It returns `true` if the environment is set to development, and `false` otherwise.
This function is used to determine if the application is running in a development environment. */
  isDev(): boolean {
    return process.env.NODE_ENV.startsWith('dev')
  },

  /* The `isProd()` function is checking if the value of the `NODE_ENV` environment variable starts with
the string "prod". It returns `true` if the environment is set to production, and `false` otherwise.
This function is used to determine if the application is running in a production environment. */
  isProd(): boolean {
    return process.env.NODE_ENV.startsWith('prod')
  },

  /* The `getAppRootDir()` function is used to determine the root directory of the application. It starts
by setting the `currentDirectory` variable to the value of `__dirname`, which represents the current
directory of the module. */
  getAppRootDir() {
    let currentDirectory = __dirname

    while (!existsSync(join(currentDirectory, 'resources')))
      currentDirectory = join(currentDirectory, '..')

    return process.env.NODE_ENV === 'prod'
      ? join(currentDirectory, 'dist')
      : currentDirectory
  },

  /* The `generateThumb` function takes an input image as a `Buffer` and a configuration object
  containing the desired height and width of the thumbnail. It uses the `sharp` library to resize the
  input image according to the provided configuration. The resized image is then converted to the PNG
  format and returned as a `Buffer` wrapped in an `Observable`. */
  generateThumb(
    input: Buffer,
    config: { height: number, width: number },
  ): Observable<Buffer> {
    return from(sharp(input).resize(config).toFormat('png').toBuffer())
  },

}
