import { useOrderStore } from './Order';
import type {
  BranchItem,
  GetAllBranchesDTO,
  GetShopNames,
  GetNameBranch,
} from '@/api/Shop/dto';
import {
  GetIdShop,
  AddShopWithBranch,
  GetAllBranchesFilters,
  ModifyBranch as ModifyBranchDTO,
} from '@/api/Shop/dto';
import type { ShopWithProducts } from '@/api/Product/dto';
import { Product } from '@/api/Product/dto';
import { ShopApi } from '@/api/Shop/endpoints';
import { useApi, usePagination } from '@/composables/index';
import { defineStore } from 'pinia';
import { useSettingStore } from '@/stores/Setting';
import { useBranchCategoriesStore } from '@/stores/BranchesCategories'

class Shop {
  name = '';
  id = '';
  categoryId = '';
}
export const useShopStore = defineStore('shop', () => {

  const { lang } = storeToRefs(useSettingStore());
  const store = useSettingStore()
  const storeCategory = useBranchCategoriesStore()
  const { orderFilterParams } = storeToRefs(useOrderStore());
  const { GET, POST, DELETE } = useApi();
  const shops = ref<BranchItem[]>([]);
  const shopsList = ref<BranchItem[]>([]);
  const { pagination } = usePagination();
  const modifShopDto = ref<Shop>(new Shop());
  const BranchNameList = ref<GetNameBranch[]>([]);
  const addShopDto = ref(new AddShopWithBranch());
  const shopDetailsDto = ref<GetIdShop>(new GetIdShop());
  const shopNames = ref<GetShopNames[]>();
  const modifyBranchDto = ref<ModifyBranchDTO>(new ModifyBranchDTO());
  const filterDto = ref<GetAllBranchesFilters>(new GetAllBranchesFilters());
  const shopProducts = ref<ShopWithProducts[]>([]);
  const SearchShops = ref('');
  const langShop = ref('ar');
 
  // Get BranchName
  async function GetBranchName() {
    try {
      const response = await GET<GetNameBranch[]>(ShopApi.GetBranchNames);

      BranchNameList.value = response.data;

      return response;
    }
    catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // get branches
  const GetAllBranches = async (search?: any) => {
    try {
      const res = await GET<GetAllBranchesDTO>(
        ShopApi.GetAllBranches + search,
        {
          ...pagination.value,
          ...filterDto.value,
        },
        {
          error: true,
        },
        { headers: { lang: lang.value } },
      );

      shops.value = res.data.branches;
      shopsList.value = res.data.branches;
      pagination.value.totalCount = res.data.branchesCount;
      
      return res
    }
    catch (e) {
      console.log(`error handler${e}`);
    }
  };

  // get branches by id
  async function GetBranchesId(id: any) {
    try {
      const res = await GET<GetIdShop>(
        ShopApi.GetBranchById,
        {
          id,
          ...orderFilterParams.value,
        },
        {
          error: true,
        },
        { headers: { lang: lang.value } },
      );

      shopDetailsDto.value = res.data;
    }
    catch (e: any) {
      console.log(e.response);
    }
    storeCategory.GetBarnchCategories(id)
  }

  // get shop name
  async function GetShopNames() {
    try {
      const res = await GET<GetShopNames[]>(ShopApi.GetShopsNames);

      shopNames.value = res.data;
    }
    catch (e: any) {
      console.log(e.response);
    }
  }

  // modify shop
  async function ModifyShop(payload: {
    name: string
    id: string
    categoryId: string
  }) {
    try {
      const res: any = await POST(
        ShopApi.ModifyShop,
        payload,
        {
          error: true,
          success: 'تم التعديل على المتجر ',
        },
        { headers: { lang: lang.value } },
      );

      modifShopDto.value = { ...res.data };

      return res;
    }
    catch (e: any) {
      console.log(e.response);
    }
  }

  // add Branches
  async function AddBranches(payload: AddShopWithBranch) {
    try {
      const res: any = await POST(
        ShopApi.AddBranch,
        { ...payload, subscriptionId: null },
        {
          error: true,
          success: `تمت إضافة المتجر ${addShopDto.value.branchName}`,
        },
        { formData: true },
      );

      shopDetailsDto.value.branch.otherBranches.push(res.data);
    }
    catch (e: any) {
      console.log(e.response);
    }
  }

  // modify Branch
  async function ModifyBranch(payload: ModifyBranchDTO) {
    try {
      const res = await POST<any, ModifyBranchDTO>(
        ShopApi.ModifyBranch,
        payload,
        {
          error: true,
          success: 'تم التعديل على الفرع ',
        },
        { formData: true, headers: { lang: lang.value } },
      );

      // shopDetailsDto.value = { ...res.data }
    }
    catch (e: any) {
      console.log(e.response);
    }
  }

  // delete branch
  async function DeleteBranch(ids: any, isdel: string) {
    try {
      const res = await DELETE(ShopApi.DeleteBranch, ids);
      if (isdel === 'mainBranch') {
        console.log('in main branch');

        shops.value = shops.value.filter(ele => !ids.includes(ele.id));
      }
      else {
        console.log('in other branch');

        shopDetailsDto.value.branch.otherBranches
          = shopDetailsDto.value.branch.otherBranches.filter(
            ele => !ids.includes(ele.id),
          );
      }
    }
    catch (e: any) {
      console.log(e.response);
    }
  }

  // Api Actions
  async function AddNewShop() {
    try {
      const res: any = await POST(
        ShopApi.AddShopWithBranch,
        addShopDto.value,
        {
          error: true,
          success: `تمت إضافة المتجر ${addShopDto.value.branchName}`,
        },
        { formData: true },
      );

      console.log(res.data);
      shops.value.push(res.data);
      console.log(shops.value);
    }
    catch (er: any) {
      console.log(er.response);
    }
  }

  // getting branch names with products
  const getBranchNamesWithProducts = async () => {
    try {
      const res = await GET<ShopWithProducts[]>(
        ShopApi.GetBranchNamesWithProduct,
        {},
        { error: true },
      );

      shopProducts.value = res.data;
    }
    catch (error) {
      console.log(error);
    }
  };

  watch(lang, () => {
    if (shopDetailsDto.value.branch.id) {
      GetBranchesId(shopDetailsDto.value.branch.id);
      store.GetAllCities()
      store.GetAllLabels()
      store.GetAllAreas()
    }
    else { GetAllBranches(SearchShops.value) }
  });

  return {
    GetBranchName,
    shopProducts,
    BranchNameList,
    GetAllBranches,
    shops,
    modifyBranchDto,
    filterDto,
    DeleteBranch,
    GetShopNames,
    shopNames,
    ModifyShop,
    ModifyBranch,
    AddBranches,
    GetBranchesId,
    shopDetailsDto,
    pagination,
    addShopDto,
    AddNewShop,
    getBranchNamesWithProducts,
    lang,
    langShop,
    SearchShops,
  };
});
