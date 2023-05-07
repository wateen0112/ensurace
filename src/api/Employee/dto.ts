import type { Pagination } from '@/types/app/Pagination';

export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  id: string
  userName: string
  accessToken: string
  refreshToken: string
}

export interface GetAllEmployee {
  id: string
  name: string
  profileImage: string
  phoneNumber: string
  email: string
  birthDate: string
  cityId: string
  address: string
  handledOrdersCount: number
  dateCreated: string
  imageUrl: string
  isBlock: boolean
}
export class AddEmployee {
  cityId = ''
  name = ''
  birthDate = ''
  imageFile = ''
  imageUrl = ''
  address = ''
  role = ''
  userName = ''
  password = ''
  email = ''
  phoneNumbers = ['']
  docsFile = []
  docsUrl = []
}
export class GetAllEmployeeFilters {
  startDate = ''
  endDate = ''
  isHidden = false
  status = ''
}
export interface GetAllEmployeeParams extends GetAllEmployeeFilters, Pagination {
}
export interface OrderPagination {
  count: number
  orders: string[]
}
export interface GetDetailsEmployeeDto {
  orderPagination: { count: 0; orders: [] }
  employee: DetailsEmployee
}
export class DetailsEmployee {
  id = ''
  role = ''
  isBlock = false
  name = ''
  userName = ''
  imageUrl = ''
  imageFile = ''
  docsUrl = ['']
  docsFile = [] as File | any
  docsUrlToDelete = ['']
  phoneNumbers = ['']
  email = ''
  birthDate = ''
  cityId = ''
  address = ''
  password = ''
}
