import type { VerticalNavItems } from '@/@layouts/types'
import contentManagement from './content-management'
import setting from './setting'

export default [
  {
    title: 'الرئيسية',
    to: { name: 'index' },
    icon: { icon: 'tabler-home' },
  },
  {
    heading: 'ادارة المحتوى',
  },
  ...contentManagement,
  {
    heading: 'الإعدادات ',
  },
  ...setting,

] as VerticalNavItems

// https://icones.netlify.app/collection/tabler?s=store
