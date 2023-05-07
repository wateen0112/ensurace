export interface HomeStatic {
  id: string
  customersCount: number
  employeesCount: number
  driversCount: number
  branchesCount: number
  productsChart: number[]
  mostAccomplishedDrivers: {
      id: string
  value: number
  name: string
  imageUrl: string
}
  mostEvaluatedDrivers: {
    id: string
  count: number
  name: string
  rate: number
  imageUrl: string
}
  }


export class HomeStaticDto {
  id = '';
  customersCount = 0;
  employeesCount = 0;
  driversCount = 0;
  branchesCount = 0;
  productsChart = [ 0, 0, 0, 0, 0, 12];
  mostAccomplishedDrivers = {
          id: '',
      count: 0,
      name: '',
      rate: 0,
      imageUrl: '',
  }

  mostEvaluatedDrivers = {
    id: '',
      value: 0,
      name: '',
      imageUrl: '',
  };
}



export interface ContactUs {
  repliedContactUsChart: number[]
  unRepliedContactusChart: number[]
}

export class ContactUsDTO {
  repliedContactUsChart = [0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0];
  unRepliedContactusChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0];
}

export interface OrderChart {
  orderChart: number[]
}

export class OrderChartDTO {
  orderChart = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}



export interface MostOrdered {
  id:string
  customers: {
    id: string
    name: string
    ordersCount: number
    phoneNumber: string
    rate: number
  }
  branches: {
    id: string
    name: string
    address: string
    ordersCount: number
    phoneNumber: string
    rate: number
  }
  products: {
    id: string
    name: string
    ordersCount: number
    rate: number
  }
}

export class CustomersDto {
  id = '';
  name = '';
  ordersCount = 0;
  phoneNumber = '';
  rate = 0;
}
export class BranchesDto {
  id = '';
  name = '';
  address = '';
  ordersCount = 0;
  phoneNumber = '';
  rate = 0;
}
export class ProductsDto {
  id = '' 
  name = ''
  ordersCount = 0
  rate = 0
}
