
export interface AllShops {
  id: string
  name: string
  address: string
  phoneNumber: string
  orderCount: number
  totalCoast: number
  dateCreated: string
  mostBuyingCustomer: string
  mostPopularProducts: string[]
}
export class GetAllSopsFilters {
  startDate = '';
  endDate = '';
}
export interface ShopsDto {
  count: number
  shops: AllShops[]
}
