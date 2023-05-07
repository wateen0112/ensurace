import type { Order_Stage } from './../../enums/OrderStage';
import type { Product, ProductExtra } from './../Product/dto';

import type { Order_Status } from '@/enums/OrderStatus'
import type { Pagination } from '@/types/app/Pagination'

export class GetAllOrdersFilters {
  // startDate = ''
  // endDate = ''
  // status?: Order_Status | '' = ''
  cityId = ''

  // search = ''
}
export interface GetAllOrdersParams extends GetAllOrdersFilters, Pagination {
}
export interface OrderItem {
  id: string
  number: number
  customerName: string
  phoneNumber: string
  address: string
  branchNames: string[]
  date: string
  driverName: string
  orderType: Order_Stage
  progress: Progress
}

interface Progress {
  status: string
  stage: string
  date: string
}
export interface GetAllOrderDTO {
  count: number
  orders: OrderItem[]

}

export interface OrderShopsItemDTO {
  areaId: string
  phoneNumber?: string
  hasDeliveryService: boolean
  id: string
  isOnline: boolean
  name: string
  address: string
  isConfirmed?: boolean
  receiveDate?: string
}
export class ConfirmAddDTO {
  customerId = ''
  offerId?: string | null = ''
  addressId = ''
  priorDate?: null | string = null
  note = ''
  id?= ''
  branches: Branch[] = []
}

export interface Branch {
  id: string
  orderCarts: OrderCart[]
}

export class OrderCart {
  productId = '';
  note = '';
  quantity = 0;
  productExtraItemIds: string[] = [];
}

// export class ConfirmReceiveBranchesDto {
//   id = "";
//   phoneNumber = "";
//   name = "";
//   address = "";
//   note = "";
//   userHandlerName = "";
//   driverName = "";
//   offer = '';
//   number = 0;
//   orderType = '';
//   priorDate = '';
//   expectedReceiveCustomerDate = '';
//   branches: BranchesOrderDetails[] = [];
//   invoice = {
//     orderCartsCount: 0,
//     coast: 0,
//     tax: 0,
//     discount: 0,
//     deliveryCoast: 0,
//     total: 0,
//   } as Invoice

// }

// export class CompleteOrderDto {
//   id = '';
//   customerName = "";
//   phoneNumber = "";
//   address = "";
//   userHandlerName = "";
//   driverName = "";
//   offer = null;
//   number = 0;
//   priorDate = null;
//   expectedReceiveCustomerDate = "";
//   receiveCustomerDate = "";
//   invoice = {
//     orderCartsCount: 0,
//     coast: 0,
//     tax: 0,
//     discount: 0,
//     deliveryCoast: 0,
//     total: 0,
//   } as Invoice
//   driverEvaluation = 0;
//   branchesEvaluation: BranchesEvaluation[] = [];
//   branches: BranchesOrderDetails[] = [];
//   orderStages: OrderStage[] = []

// }


export class OrderDetailDto {
  id = '';
  phoneNumber = '';
  customerName = '';
  name?= '';
  address = '';
  note?= '';
  userHandlerName = '';
  driverName = '';
  offer?= null;
  number = 0;
  orderType = '';
  isPrior?= false;
  priorDate = null;
  totalCost?= 0;
  orderDate?= '';
  expectedReceiveCustomerDate = '';
  driverEvaluation?= 0;
  receiveCustomerDate?= '';
  deliveryCost?= 0;
  orderCartCount?= 0;
  branches: BranchesOrderDetails[] = [];
  orderStages: OrderStage[] = [];
  branchesEvaluation?: BranchesEvaluation[] = [];
  driverConfirmDate?= '';
  reason?= '';
  invoice?= {
    orderCartsCount: 0,
    coast: 0,
    tax: 0,
    discount: 0,
    deliveryCoast: 0,
    total: 0,
  } as Invoice
}
export class BranchesOrderDetails {
  id = '';
  name = '';
  note = '';
  receiveDate = null;
  orderCarts: OrderCartsDetails[] = []
  isConfirmed: boolean | undefined;
  address = '';
  billUrl?= '';

}

export class OrderCartsDetails {
  id = '';
  quantity = 0;
  name = '';
  note = '';
  imageUrl = '';
  price = 0;
  productExtraItems: ProductExtra[] = [];
}
export class CartItem implements Product {
  productExtraItems?: ProductExtra[] = [];
  id = ''
  name = ''
  imageUrl = ''
  branchId = ''
  note = ''
  quantity = 0
  price = 0

}

interface BranchesEvaluation {
  value: string
  name: string
}
interface Customer {
  id: string
  name: string
  phoneNumber: string
  address: string
  orderNumber: number
}

interface Invoice {
  orderCartsCount: number
  coast: number
  tax: number
  discount: number
  deliveryCoast: number
  total: number
}

interface OrderStage {
  name: string
  dateTime: string
}

export interface ConfirmedOrderBranshes {
  id: string
  phoneNumber: string
  categoryName: string
  address: string
  name: string
  isConfirmed: boolean
  areaId?: string
  billUrl?: string
  receiveDate?: string
  orderCarts: ConfirmedOrderCart[]
}

interface ConfirmedOrderCart {
  id: string
  name: string
  note: string
  imageUrl: string
  price: number
  quantity: number
  acceptedPriceChange: boolean
  productExtraItems: ProductExtra[]
}



export interface GetConfirmedOrderDTO {
  id: string
  note: string
  offer: string
  branches: ConfirmedOrderBranshes[]
  orderStages: OrderStage[]
  invoice: Invoice
  customer: Customer
}

export class ConfirmBranshDTO {
  id = ''
  note = ''
  branchId = ''
  estimatedTime = ''
}




export interface GetConfirmDriverDTO {
  id: string
  orderDetails: OrderDetailsType
  customer: Customer
  expectedReceiveDates: ExpectedReceiveDate[]
  orderStages: OrderStage[]
  drivers: Driver[]
}

export interface Driver {
  id: string
  name: string
  phoneNumbers: string[]
  details: string[]
}


export interface ExpectedReceiveDate {
  branchName: string
  date: string
}

interface Customer {
  id: string
  name: string
  phoneNumber: string
  address: string
  orderNumber: number
}

interface OrderDetailsType {
  cost: number
  deliveryCost: number
  orderCartsCount: number
  isPrior: boolean
  totalCost: number
}
