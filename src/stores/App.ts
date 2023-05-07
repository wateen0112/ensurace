import { useSettingStore } from './Setting';
import type { PageMeta } from '@/types/app/PageMeta'
import { useNotificationStore } from './Notification';

export const useAppStore = defineStore('App', () => {
  const settingStore = useSettingStore()
  const notificationStore = useNotificationStore();
  const inputLang = ref('')

  const PageMeta = ref<PageMeta>({
    title: '',
    icon: '',
    breadCrumb: [],
  })

  const isLoading = ref(false)
  const dialogUserHandling = false;
  function SetPageMeta(meta: PageMeta) {
    PageMeta.value = { ...meta }
  }

  const startupCalls = () =>
    Promise.all([
      settingStore.GetAllAreas(),
      settingStore.GetAllCities(),
      settingStore.GetAllLabels(),
      settingStore.GetCitiesWithArea(),
      settingStore.GetAllShopCategories(),
      notificationStore.GetUnRead(),
    ])

  return { PageMeta, SetPageMeta, isLoading, startupCalls, inputLang, dialogUserHandling }
})
