type RouteParam = string | string[] | undefined

export function getPlayerIdFromParam(param: RouteParam): number {
  const rawParam = Array.isArray(param) ? param[0] : param

  return Number(rawParam)
}
