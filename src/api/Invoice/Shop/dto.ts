export interface GetAllBranchInvoice {
  id: string
  name: string
  lastInvoiceDate: string
  ordersCount: number
  unPaidOrdersCount: number
  incoming: number
}

export interface GetByIdBranchInvoice {
  id: string
  number: number
  dateCreated: string
  incoming: number
}
export interface Orders {
  id: string
  dateCreated: string
  orderNumber: number
  profitPercent: number
  coast: number
  coastWithDiscount: number
  incoming: number
}
export interface GetUnPaidBranchInvoice {
  number: number
  orders: Orders[]
}
export class AddInvoice {
 incomming = 0
 note = ''
 branchOrderIds = ['']
}
export class GetDetailsInvoice {
  id = ''
  number = 0
  incoming = 0
  dateCreated = ''
  note = ''
  orders: Orders[] = [{
    id: '',
    dateCreated: '',
    orderNumber: 0,
    profitPercent: 0,
    coast: 0,
    coastWithDiscount: 0,
    incoming: 0,
  }]
}
