// 1. External imports

// 2. Internal imports

export type RouteParam = string | string[] | undefined

export function extractRouteParam(param: RouteParam): string | undefined {
  return Array.isArray(param) ? param[0] : param
}
