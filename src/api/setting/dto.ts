export class GetAllCity {
  id = ''
  name = ''
  dateCreated = ''
}
export class GetAll {
  id = ''
  name = ''
  dateCreated = ''
}
export class LinkDto {
  id = ''
  name = ''
  link = ''
}
export class GetAllArea {
  id = ''
  name = ''
  cityName = ''
  dateCreated = ''

}
export class ShopCategories {
  id = ''
  name = ''
  dateCreated = ''
  imageUrl = ''
}
export class AddCategoryDto {
  name = ''
  imageFile = null
  imageUrl = ''
  id = ''
}

export class SystemStandar {
  offerLimit = 0;
  offerBaseOrderAmount = 0;
  driverPayment = {
    value: 0,
    valueType: '',
  }

  offerDiscount = {
    value: 0,
    valueType: '',
  }

  offerPeriod = 0;
  maximumOrder = 0;
}

export class DeliveryPricing {
  id = '';
  extraTime = 0;
  area1Name = '';
  area2Name = '';
  dateUpdated = '';
  price = 0;
}

export interface DefaultDriverProfit {
  value: number
  valueType: string
}
export interface Areas {
  id: string
  name: string
  isDormitory: false
}
export interface CityWithArea {
  id: string
  name: string
  areas: Areas[]
}
