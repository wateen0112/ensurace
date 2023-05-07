// ! DONT TOUCH THIS FILE
// import { axiosIns } from '@/core/libs';
import type { LoginResponse } from '@/api/Employee/Dto'
import type { LoginRequest } from '@/api/Employee/dto'
import { EmployeeApi } from '@/api/Employee/endpoints'
import { UserApi } from '@/api/User/UserEndpoint'
import { useApi } from '@/composables'
import { axiosIns } from '@/plugins/axios'
import router from '@/router'
import type { RefreshTokenDecoded } from '@/types/auth/RefreshTokenDecoded'
import type { AxiosError } from 'axios'
import jwt_decode from 'jwt-decode'
import { useToast } from 'vue-toastification'
import { API_URL } from '~config'

interface useAuthconfig {
  baseUrl: string
  loginEndpoint: string
  refreshTokenEndPoint: string
  key: string
}

const authConfig: useAuthconfig = {
  baseUrl: API_URL,
  loginEndpoint: EmployeeApi.Login,
  refreshTokenEndPoint: UserApi.RefreshToken,
  key: 'fly-order',
}

enum BaseRoles {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Customer = 'Customer',
  Employee = 'Employee',
  DataEntry = 'DataEntry',
  OrderHandler = 'OrderHandler',
  Accountant = 'Accountant',
  Marketer = 'Marketer',
}
export const isLoggedIn = () => {
  return localStorage.getItem(`${authConfig.key}-user-data`)
}
export const useAuth = (config: useAuthconfig = authConfig) => {
  const toast = useToast()

  const { POST } = useApi()

  async function Login(payload: LoginRequest) {
    try {
      const response = await POST(config.loginEndpoint, payload, { comfirm: false, success: false, error: false })

      console.log(response)
      if (response.status === 200) {
        SetUserData(response.data)
        router.push('/')

        return response
      }
    }
    catch (er) {
      const result = HandleLoginError(er as AxiosError, payload)

      console.log('CATCH', er)
      toast.error(result)
    }
  }
  function SetUserData(userData: LoginResponse) {
    localStorage.setItem(`${authConfig.key}-user-data`, JSON.stringify(userData))
  }
  function GetUserData(): LoginResponse | null {
    const userData = localStorage.getItem(`${authConfig.key}-user-data`)
    if (userData)
      return JSON.parse(userData)
    else
      return null
  }
  function GetAccessToken() {
    const userData = GetUserData()
    if (userData && userData.accessToken)
      return userData.accessToken

    else return null
  }
  function GetAccessTokenDecoded(): RefreshTokenDecoded | null {
    if (GetAccessToken())
      return jwt_decode(GetAccessToken() as string)
    else return null
  }
  function IsAdmin() {
    return (GetUserRoles()?.includes(BaseRoles.SuperAdmin) || GetUserRoles()?.includes(BaseRoles.Admin))
  }
  function GetRefreshToken() {
    return GetUserData()?.refreshToken
  }
  function GetUserRoles() {
    return GetAccessTokenDecoded()?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  }
  function IsLoggedIn() {
    return !!GetAccessToken()
  }
  function LogOut() {
    localStorage.removeItem(`${config.key}-user-data`)
    router.push('/login')
  }
  function ActionsGaurd(name: string, action: string) {
    if (name === 'Public')
      return true

    return (GetUserRoles()?.includes(`${name}-${action}`) || GetUserRoles()?.includes(BaseRoles.SuperAdmin))
  }
  async function RefreshToken() {
    const userData = GetUserData()
    try {
      const response = await axiosIns.post(config.refreshTokenEndPoint,
        {
          id: userData?.id,
          refreshToken: GetRefreshToken(),
        })

      const { accessToken } = response.data
      if (!accessToken)
        LogOut()

      if (accessToken && userData) {
        SetUserData({
          ...userData,
          accessToken,
        })
      }

      return accessToken
    }
    catch (error) {
      LogOut()
    }
  }
  function HandleLoginError(error: Error & AxiosError, requestBody: LoginRequest) {
    console.log(error)

    if (error.response) {
      if (error.response.status === 404 || error.response.status === 403)
        return 'المستخدم غير موجود .. يرجى التحقق من صحة المعلومات'
      else if (error.response.status === 400)
        return 'كلمة المرور خاطئة .. يرجى التأكد من حالة الأحرف '

      else if (error.response.status === 500)
        return 'حدث خطأ في الخادم .. يرجى اعادة المحاولة'
      else return 'حدث خطأ ما'
    }

    else { return error.message }
  }
  function GetHomePage() {
    const userRole = GetUserRoles()
    switch (userRole) {
      case BaseRoles.SuperAdmin:
        return '/'
      case BaseRoles.DataEntry:
        return 'content-management/shops'
      case BaseRoles.OrderHandler:
        return '/content-management/orders'
      case BaseRoles.Accountant:
        return 'content-management/invoice/shop'
      case BaseRoles.Marketer:
        return 'content-management/adverts'
    }

  }

  return {
    GetAccessToken,
    IsAdmin,
    GetRefreshToken,
    GetUserRoles,
    IsLoggedIn,
    LogOut,
    GetUserData,
    ActionsGaurd,
    GetAccessTokenDecoded,
    RefreshToken,
    Login,
    SetUserData,
    GetHomePage,
    BaseRoles,
  }
}
