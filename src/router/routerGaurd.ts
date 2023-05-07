import type { NavigationGuardNext, RouteRecordRaw } from 'vue-router'

export default function routerGaurd(to: RouteRecordRaw, from: RouteRecordRaw, next: NavigationGuardNext) {
  next(true)
}
