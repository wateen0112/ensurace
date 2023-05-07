import { useAuth } from '@/composables';
import { useAppStore } from '@/stores/App';
import type { Axios, AxiosError, AxiosHeaders } from 'axios';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_URL } from '~config';

const errorHandler = async (error: AxiosError) => {
  const { RefreshToken } = useAuth();

  useAppStore().$patch({ isLoading: false })

  const config: AxiosRequestConfig | undefined = error?.config

  // if (error.response?.status === 401) {
  //   const accessToken = await RefreshToken();
  //   if (config && config.headers) {
  //     config.headers.Authorization = `Bearer ${accessToken}`;

  //     return axios(config)
  //   }

  // }

  return Promise.reject(error)
}

const requestHandler = (request: AxiosRequestConfig) => {
  if (request.params && request.params.loading !== false)
    useAppStore().$patch({ isLoading: true })

  const { GetAccessToken } = useAuth()

  if (request.headers)
    request.headers.Authorization = `Bearer ${GetAccessToken()}`

  return request
}

const responseHandler = (response: AxiosResponse) => {
  useAppStore().$patch({ isLoading: false })

  return response
}

const axiosIns = axios.create({
  baseURL: API_URL,
  headers: { lang: useNavigatorLanguage().language.value },

})

axiosIns.interceptors.request.use(requestHandler as any)
axiosIns.interceptors.response.use(responseHandler, errorHandler)

export { axiosIns };

// // const progressHandler = (progressEvent: any) => {
// //     console.log('in progress', progressEvent);

//     // const total = parseFloat(progressEvent.currentTarget.responseHeaders['Content-Length'])
//     // const current = progressEvent.currentTarget.response.length

//     // let percentCompleted = Math.floor(current / total * 100)

// // }

