import type {
  Address,
  ResidentialAddress,
  DormitoryAddress,
} from '@/types/address';
import type { Pagination } from '@/types/app/Pagination';
import type { OrderItem } from '../Order/dto';

export class GetAllCustomerFilters {
  startDate = '';
  endDate = '';
  isHidden = false;
  status = '';
}
export interface GetOrderCustomer {
  id: string
  name: string
  phoneNumber: string
  orders: string[{
    id: string
    number: string
    dateCreated: string
  }]
}

export interface GetAllCustomerParams
  extends GetAllCustomerFilters,
  Pagination { }
export interface GetAllCustomer {
  id: string
  name: string
  phoneNumber: string
  cityId: string
  orderCount: number
  lastOrderDate: string
  birthDate: string
}
export interface GetAllCustomerDTO {
  count: number
  customers: GetAllCustomer[]
}
export class AddCustomer {
  firstName = '';
  lastName = '';
  phoneNumber = '';
  email = '';
  cityId = '';
  birthDate = '';
  address: Address = {
    id: '',
    name: '',
    cityId: '',
    areaId: '',
    residentialAddress: {
      street: '',
      details: '',
      floor: 0,
      building: '',
    },
    dormitoryAddress: {
      numberNum: '',
      roomNum: '',
    },
  };
}
export interface OrderPagination {
  count: number
  orders: string[]
}
export interface GetDetailsCustomerDto {
  orderPagination: { count: 0; orders: [] }
  customer: DetailsCustomer
}
export interface FavPro {
  id: ''
  name: ''
  category: ''
}
export interface Favourite {
  peroducts: FavPro[]
  brunchs: FavPro[]
}
export class DetailsCustomer {
  id = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  cityId = '';
  birthDate = '';
  email = '';
  address: Address[] = [
    {
      id: '',
      name: '',
      cityId: '',
      areaId: '',
      residentialAddress: {
        street: '',
        details: '',
        floor: 0,
        building: '',
      },
      dormitoryAddress: {
        numberNum: '',
        roomNum: '',
      },
    },
  ];

  favourite: Favourite = {
    peroducts: [{
      id: '',
      name: '',
      category: '',
    }],
    brunchs: [{
      id: '',
      name: '',
      category: '',
    }],
  }
}

export class AddAddress {
  id = '';
  customerId = 'fa67d1bc-44d5-45e2-9854-8e5fb2640f52';
  name = '';
  cityId = '';
  areaId = '';
  residentialAddress: ResidentialAddress = {
    building: '',
    details: '',
    street: '',
    floor: 0,
  };

  dormitoryAddress: DormitoryAddress = {
    numberNum: '',
    roomNum: '',
  };
}

interface Order {
  id: string
  branchesNames: string[]
  dateCreated: string
  orderCarts: string[]
  isPrior: boolean
  status: string
  driverName: string
  price: number
}
export interface CustomerOrderItem {
  id: string
  branchesNames: string[]
  dateCreated: string
  orderCarts: string[]
  isPrior: boolean
  status: string
  driverName: string
  price: number
}
export interface CustomerSearchDTO {
  id: string
  name: string
  phoneNumber: string
  cityId: string
  addresses: Address[]
  orders: CustomerOrderItem[]
  orderNumber?: number
  address?: string
  addressId?: string
}
export class CustomerSearch {
  id = '';
  name = '';
  phoneNumber = '';
  cityId = '';
  addresses: Address[] = [];
}
