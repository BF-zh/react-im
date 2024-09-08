export function Cookies() {
  const filter = /PATH|DOMAIN|EXPIRES|Path|Domain|Secure|SameSite|Expires/
  function parse(str: string): Record<string, string> {
    return Object.fromEntries(str?.split(';').map(item => item.trim().split('=')).filter(([K]) => Boolean(K) && !(filter.test(K))))
  }
  function format(str: string) {
    return str?.split(';').map(item => item.trim().split('=')).filter(([K, V]) => Boolean(K) && Boolean(V) && !(filter.test(K))).map(([K, V]) => `${K}=${V}`).join('; ')
  }
  return {
    parse,
    format,
  }
}
