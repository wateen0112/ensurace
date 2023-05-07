// ! DONT TOUCH THIS FILE

import { axiosIns } from '@/plugins/axios'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { serialize } from 'object-to-formdata'
import type { SweetAlertOptions } from 'sweetalert2'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'

interface NotificationsType { error?: string | boolean; comfirm?: SweetAlertOptions | boolean; success?: string | boolean }
interface paramsType { [param: string]: any }
const defaultSerializerOptions = { indices: true, dotsForObjectNotation: true, noFilesWithArrayNotation: true }

const defaultPostNotifications: NotificationsType = {
  comfirm: false,
  success: false,
  error: true,
}

const defaultGetNotification: NotificationsType = {
  comfirm: false,
  success: false,
  error: true,
}

const defaultDeleteNotification: NotificationsType = {
  comfirm: {
    text: 'سيتم حذف العنصر المحدد .. هل انت متأكد ؟ ',
    icon: 'warning',
    confirmButtonText: 'نعم',
    denyButtonText: 'تراجع',
  },
  error: true,
  success: 'تم الحذف بنجاح',

}

export const useApi = () => {
  const toast = useToast()

  const handleErrorMessage = ({ response }: AxiosError | any, notifications: string | boolean) => {

    if (typeof notifications == 'boolean' && response) {

      console.log('');



      if (response.data) {

        if (response.data.message) 
          toast.error(response.data.message)

        if (response.data.validationErrors) {

          response.data.validationErrors.forEach((err: any) => {
            toast.error(err.description)
          });
        }


        if (typeof response.data === 'object' && response.data.title)
          toast.error(response.data.title, { timeout: 10000 })
        if (response.data.errors) {
          for (const key in response.data.errors) {
            if (Object.prototype.hasOwnProperty.call(response.data.errors, key)) {
              const errorType = response.data.errors[key];
              if (typeof errorType == 'object' && Array.isArray(errorType)) {
                errorType.forEach(msg => {
                  toast.error(msg);
                });
              }
            }
          }
        }

      }

      else if (response.message) {
        toast.error(response.message);
      }
      else if (response.statusText) {
        toast.error(response.statusText);
      }
      else { toast.error('Server Error'); }
    }



    else if (typeof notifications == 'string') {
      toast.error(notifications)
    }
  };

  const GET = async <T>(url: string, params?: paramsType, notifications: NotificationsType = defaultGetNotification, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosIns.get<T>(url, { params, ...config })

      return { ...response, data: response.data as T }
    }

    catch (error) {
      if (notifications.error)
        handleErrorMessage(error, notifications.error)

      throw (error)
    }
  }

  const POST = async <ResT, ReqT>(url: string, body: ReqT, notifications: NotificationsType = defaultPostNotifications, config: AxiosRequestConfig & { formData?: boolean } = {}) => {
    try {
      let response
      if (config.formData) {
        response = await axiosIns.post<ReqT, AxiosResponse<ResT>, FormData>(url, serialize(body, defaultSerializerOptions)
          , { ...config })
      }
      else {
        response = await axiosIns.post<ReqT, AxiosResponse<ResT>, ReqT>(url, { ...body }, { ...config })
      }

      if (notifications.success && response.status === 200) {
        if (typeof (notifications.success) == 'string')
          toast.success(notifications.success)
        else
          toast.success('success')
      }

      return response
    }
    catch (error) {
      if (notifications.error) {
        console.log('Error Catched', error)

        handleErrorMessage(error, notifications.error)

        throw (error)

      }
    }
  }

  const DELETE = async (url: string, body: any, params?: paramsType, notifications: NotificationsType = defaultDeleteNotification, config?: AxiosRequestConfig) => {

    return new Promise((resolve, reject) => {
      console.log('Delete APi', notifications)
      if (notifications.comfirm && typeof notifications.comfirm == 'object') {
        Swal.fire({
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          ...notifications.comfirm,

        }).then(result => {
          if (result.isConfirmed) {
            axiosIns.delete(url, { params, ...config, data: body }).then(res => {
              if (res.status === 200 && typeof (notifications.success) == 'string')
                toast.success(notifications.success)
              resolve(res)
            }).catch(er => {
              if (typeof notifications.error === 'boolean' || typeof notifications.error === 'string')
                handleErrorMessage(er, notifications.error)
              reject(er)

            })
          }
        })
      }

      else {
        axiosIns.delete(url, { ...params, ...config }).then(res => {
          if (res.status === 200 && typeof (notifications.success) == 'string')
            toast.success(notifications.success)
          resolve(res)
        }).catch(er => {
          if (typeof notifications.error === 'boolean' || typeof notifications.error === 'string')
            handleErrorMessage(er, notifications.error)
          reject(er)
        })
      }
    })
  }

  return {
    GET,
    POST,
    DELETE,
  }
}
