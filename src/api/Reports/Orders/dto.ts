import type { Order_Stage } from './../../../enums/OrderStage';

export interface AllOrders {
  id: string
  number: number
  customerName: string
  phoneNumber: string
  address: string
  branchNames: string[]
  date: string
  driverName: string
  orderType: Order_Stage
  status: string
  progress: Progress
}
export class GetAllOrderFilters {
  startDate = '';
  endDate = '';
  status = '';
}
export interface OrderDto {
  count: number
  orders: AllOrders[]
}
interface Progress {
  status: string
  stage: string
  date: string
}

export class AllOrdersDTO {
  id = ''
  number = 0
  customerName = ''
  phoneNumber = ''
  address = ''
  branchNames = [];
  date = ''
  driverName = ''
  orderType = ''
  status = ''
  progress = ''
}
