export interface BreadCrumbItem {
  text: string
  icon: string
  isActive?: boolean
  path?: string
}
export interface PageMeta {
  title: string
  icon: string
  breadCrumb: BreadCrumbItem[]
}
