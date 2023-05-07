export interface GetAllDriverInvoice {
  id: string
  name: string
  lastInvoiceDate: string
  orderCount: number
  driverPayment: string
  outComing: number
}
export interface GetByIdDriverInvoice {
  id: string
  number: number
  dateCreated: string
  outComing: number
}
export interface Order {
  id: string
  dateCreated: string
  number: number
  driverPayment: string
  deliveryCost: number
  outComing: number
}
export interface GetUnPaidDriverInvoice {
  number: number
  orders: Order[]
}
export class AddInvoice {
 outComing = 0
 note = ''
 orderIds = ['']
}
export class GetDetailsInvoice {
  id = ''
  number = 0
  outComing = 0
  dateCreated = ''
  note = ''
  orders: Order[] = [{
    id: '',
    dateCreated: '',
    number: 0,
    driverPayment: '',
    deliveryCost: 0,
    outComing: 0,
  }]
}
