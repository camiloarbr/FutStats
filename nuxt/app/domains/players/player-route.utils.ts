// 1. External imports

// 2. Internal imports
import { extractRouteParam, type RouteParam } from '~~/shared/utils/route.utils'

export function getPlayerSlugFromParam(param: RouteParam): string {
  return extractRouteParam(param) ?? ''
}
