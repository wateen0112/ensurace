import type { Branch } from './../Order/dto';

export interface CalcInvoiceDTO {
  offerId?: string | null
  areaId: string
  customerId: string
  branches: Branch[]
}

export interface InvoiceDTO {
  orderCartsCount: number
  coast: number
  tax: number
  discount: number
  deliveryCoast: number
  total: number
}
