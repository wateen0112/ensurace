import type { Pagination } from '@/types/app/Pagination';
import { WorkTimeDto } from '@/types/shared/WorkTimes';


export class GetAllDriverFilters {
  startDate: '' | undefined
  endDate: '' | undefined
  driverStatus: '' | undefined
}


export interface GetAllDrivers extends GetAllDriverFilters, Pagination {

}


// export interface GetAllDriversDto {
//   count: number
//   drivers: DriverDto[]
// }
export class AddDriverDto  {
  driver= new  Driver();
  orderPagination= new OrderPagination();
}

export class GetDriverByIdDto  {
  driver= new  Driver();
  orderPagination= new OrderPagination();
}
class telgramAccount { 
  userName="" //temporary
}



class OrderPagination {
  count= 0;
  orders= <Order []>[];
}

interface Order {
  id: string;
  number: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  branchNames: string[];

  date: string;
  driverName?: string;
  orderType: string;
  progress: Progress;
}

interface Progress {
 
  stage: string;
  date: string;
  status:string
}

class Driver {
  id= "";
  name= "";
  dateCreated=""
  birthDate= "";
  selected=false;
  telegramAccount= new telgramAccount();
  email= "";
  address= "";
  phoneNumbers= <any>[""];
  cityId= "";
  docsUrl=[]
  imageUrl= "";
  status="";
  driverStatus="";
  imageFile=null
  docsUrlToDelete=<any>[]
  workTime=   <WorkTimeDto[]>[]
  orderPagination
=new OrderPagination()
  docsFiles =<any>[]
  bloodType= BooldType.ANegative;
  payment =  new Payment()
}



export enum BooldType  {
APositive= "APositive",
ANegative= "ANegative",
AbPositive= "AbPositive",
AbNegative= "AbNegative",
OPositve= "OPositive",
ONegative="ONegative",
BPositive="BPositive",
BNegative="BNegative"

}
export class Payment { 
  value =0.0 
  valueType = PaymentValueType.Rate
}
export enum PaymentValueType  {
  Rate= "Rate",
  Value="Value"
}

export enum driverdriverdriverStatus {

  Available ="Available",
  Basy ="Basy"
}
export interface GetAllDriversDto {
  id: string;
  name: string;
  imageUrl: string;
  phoneNumber: string;
  ordersCount: number;
  dateCreated: string;
  address: string;
  driverStatus: string;
}
