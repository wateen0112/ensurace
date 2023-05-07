import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'نظام الطوارئ',
    to: { name: 'content-management-emergency' },
    icon: { icon: 'tabler-phone-plus' },
  },
  {
    title: 'الإعدادات العامة',
    to: { name: 'setting' },
    icon: { icon: 'tabler-settings' },
  },

  {
    title: 'تسجيل الخروج',
    to: { name: 'login' },
    icon: { icon: 'tabler-logout' },
  },

] as VerticalNavItems
