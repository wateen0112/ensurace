import type { Pagination } from "@/types/app/Pagination";
export interface OrdersChart {
  Year: string;
  ordersCount: number[];
  totalCoast: number[];
  totalDeliveryCoast: number[];
}
export interface CustomerDto {
  count: number;
  customers: AllCustomer[];
}

export interface GetAllCustomerParams
  extends GetAllCustomerFilters,
    Pagination {}

export class GetAllCustomerFilters {
  startDate = "";
  endDate = "";
  status = "";
  isHidden = false;
  search = "";
}

export interface AllCustomer {
  id: string;
  name: string;
  phoneNumber: string;
  city: string;
  birthDate: string;
  address: string;
  orderCount: number;
  totalCoast: number;
  lastOrderDate: string;
  lastOrderStatus: string;
}
export class ChartDto {
  Year = "2023";
  ordersCount = [];
  totalCoast = [];
  totalDeliveryCoast = [];
}
export class CustomerFilter {
  id = "";
  name = "";
  phoneNumber = "";
  city = "";
  birthDate = "";
  address = "";
  orderCount = 0;
  totalCoast = 0;
  lastOrderDate = "";
  lastOrderStatus = "";
}
