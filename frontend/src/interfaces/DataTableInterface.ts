// @author: Camilo | FutStats
export interface DataTableColumnInterface {
  key: string
  label: string
  sortable?: boolean
}

export interface DataTableRowInterface {
  id: number
  [key: string]: string | number
}
