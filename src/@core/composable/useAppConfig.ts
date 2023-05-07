// ! DONT TOUCH THIS FILE

import { ref } from 'vue'
import { HOST_DOMAIN } from '~config'

export const useAppConfig = () => {
  const hostDomain = ref(HOST_DOMAIN)

  const fileUrl = (url: string) => `${hostDomain.value}/${url}`

  return { hostDomain, fileUrl, projectLogoUrl, projectName }
}
