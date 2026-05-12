type RouteParam = string | string[] | undefined

export function getSlugFromParam(param: RouteParam): string {
  const rawParam = Array.isArray(param) ? param[0] : param

  return rawParam ?? ''
}
