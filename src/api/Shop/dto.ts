import type { Pagination } from '@/types/app/Pagination';
import type { Image } from '@/types/shared/Image';
import type { WorkTimeDto } from '@/types/shared/WorkTimes';
import type { Tax } from '@/types/tax/Tax';

export interface GetShopsNames {
  shopId: string
  shopName: string
  categoryId: string
  categoryName: string
}
export class GetAllBranchesFilters {
  startDate = "";
  endDate = "";
  isHidden = false;
  cityId = "";
}
export interface GetAllBranchesParams extends GetAllBranchesFilters, Pagination {
}
export interface BranchItem {
  id: string
  imageUrl: string
  name: string
  isOnline: boolean
  shopName: string
  category: string
  address: string
  area: string
}
export interface GetAllBranchesDTO {
  branchesCount: number
  branches: BranchItem[]
}
export class AddShopWithBranch {
  name = ''
  branchName = ''
  description = ''
  cityId = ''
  subscriptionId = ''
  categoryId = ''
  areaId = ''
  autoGenerateInvoice = false
  address = ''
  ownerPhoneNumber = ''
  phoneNumber = ''
  labelsIds = []
  image: Image = {
    defaultFile: null,
    otherFiles: [],
  }

  shopId?= ''

  workTimes: WorkTimeDto[] = []

  tax: Tax = {
    value: '',
    valueType: 'Value',
  }
}

export class GetShopNames {
  shopId = '';
  shopName = '';
  categoryId = '';
  categoryName = '';
}
export interface OtherBranches {
  cityId: string
  dateCreated: string
  evaluation: number
  id: string
  name: string
}
export class ProductBranch {

  id = '';
  name = '';
  imageUrl = '';
  isAvailable = false;
  price = 0;
}
export class BranchCategories {
  id = '';
  name = '';
  imageUrl = '';
  products = [] as ProductBranch[]
}
export class ModifyBranch {
  id = '';
  name = '';
  phoneNumber = '';
  ownerPhoneNumber = '';
  description = '';
  address = '';
  cityId = '';
  areaId = '';
  isHidden = false;
  autoGenerateInvoice = false;
  workTimes: WorkTimeDto[] = []
  labelIds = []
  tax = {
    value: 0,
    valueType: 'Rate',
  };

  image = {
    defaultFile: null,
    otherFiles: [] as File | any,
    deleteOther: [],
  }
}

export class GetIdShop {
  branch = {
    isOnline: false,
    id: '',
    shopId: '',
    shopName: '',
    name: '',
    labelsIds: [],
    categoryId: '',
    phoneNumber: '',
    ownerPhoneNumber: '',
    subscriptionId: '',
    description: '',
    evaluation: 0,
    cityId: '',
    address: '',
    areaId: '',
    isHidden: false,
    categories: [] as BranchCategories[],
    autoGenerateInvoice: false,
    workTimes: [] as WorkTimeDto[],
    dateCreated: '',
    tax: {
      value: 0,
      valueType: 'Rate',
    },
    image: {
      defaultUrl: '',
      othersUrls: [],
    },
    otherBranches: [] as OtherBranches[],
  };

  orderPagination
    = { count: 0, orders: [] }
}
export interface GetNameBranch {
  id: string
  name: string
}
