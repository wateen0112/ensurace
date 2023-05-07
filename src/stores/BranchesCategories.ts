import { AddBranchCategories } from '@/api/BranchCategory/dto';
import type { BranchCategories } from '@/api/Shop/dto';
import { BranchCategoryApi } from '@/api/BranchCategory/endpoints';
import { useApi } from '@/composables/index';
import { defineStore } from 'pinia';
import { useShopStore } from './Shop';

export const useBranchCategoriesStore = defineStore('BranchCategories', () => {
  const { shopDetailsDto, lang } = storeToRefs(useShopStore());
  const { GET, POST, DELETE } = useApi();
  const branchCategories = ref<BranchCategories[]>([]);
  const addBranchCategoryDto = ref<AddBranchCategories>(new AddBranchCategories());
  async function GetBarnchCategories(branchId: any) {
    try {
      const response = await GET<BranchCategories[]>(BranchCategoryApi.GetAll, { branchId });
      console.log(response);
      branchCategories.value = response.data;

      return response;
    }
    catch (error) {
      console.log(error);
    }
  }

  async function DeleteBarnchCategories(id: string) {
    try {
      const response = await DELETE(BranchCategoryApi.Delete, null, { id });
      console.log(response);
      branchCategories.value = branchCategories.value.filter(
        (ele) => ele.id !== id,
      );

      return response;
    }
    catch (error) {
      console.log(error);
    }
  }

  async function AddBarnchCategories(payload: any) {
    delete payload.imageUrl;
    delete payload.id;
    console.log(payload);

    try {
      const response: any = await POST(
        BranchCategoryApi.Add,
        payload,
        { success: 'تم الاضافة بنجاح' },
        { formData: true },
      );
      branchCategories.value.unshift(response.data);
      console.log(response);

      return response;
    }
    catch (error) {}
  }

  async function ModifyBarnchCategories(payload: any) {
    console.log(payload);
    try {
      const response: any = await POST(
        BranchCategoryApi.Modify,
        payload,
        { success: 'تم تعديل بنجاح' },
        { formData: true, headers: { lang: lang.value } });
      addBranchCategoryDto.value = { ...response.data };

      console.log(response.data);

      return response;
    }
    catch (error) {
      console.log(error);
    }
  }

  return {
    addBranchCategoryDto,
    AddBarnchCategories,
    GetBarnchCategories,
    DeleteBarnchCategories,
    ModifyBarnchCategories,
  };
});
