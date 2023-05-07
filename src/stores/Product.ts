import { ProductApi } from '@/api/Product/endpoints';
import { AddProduct } from '@/api/Product/dto';
import { defineStore } from 'pinia';
import { useApi, usePagination } from '@/composables/index';
import type { ShopWithProducts } from '@/api/Product/dto';

export const useProductStore = defineStore('Product', () => {
  const { GET, POST, DELETE } = useApi();
  const addProductDto = ref(new AddProduct());
  const shopProducts = ref<ShopWithProducts[]>([]);

  const lang = ref('ar');

  async function AddNewProduct(payload: any) {
    delete payload.image.defaultUrl;
    delete payload.image.othersUrls;
    try {
      return await POST(
        ProductApi.Add,
        payload,
        { error: true, success: 'تم الاضافة بنجاح' },
        {
          formData: true,
          headers: {
            lang: lang.value,
          },
        },
      );
    }
 catch (er) {}
  }

  // get id product
  async function GetIdProduct(id: string) {
    try {
      const res = await GET<AddProduct>(
        ProductApi.GetById,
        { id },
        { error: true },
        { headers: { lang: lang.value } });
      console.log(res.data);
      addProductDto.value = { ...res.data };
      console.log('test', addProductDto);

    }
 catch (error) {
      console.log(error);
    }
  }

  // modify product
  async function ModifyProduct(payload: any) {
    try {
      const res: any = await POST(
        ProductApi.Modify,
        payload,
        { success: 'تم التعديل بنجاح' },
        { formData: true, headers: { lang: lang.value } },
      );
    }
 catch (error) {
      console.log(error);
    }
  }
  async function DeleteProduct(id: any) {
    console.log(id);
    
    try {
      const response = await DELETE(
        ProductApi.Delete,
        null,
        { id },
        { error: true, success: 'تم الحذف بنجاح' },
      );
      console.log("in delete product hhhhhhhhhhhhhh");
      
    }
    catch (er) {
      console.log(er);
      
    }
  }

  return {
    AddNewProduct,
    GetIdProduct,
    ModifyProduct,
    addProductDto,
    DeleteProduct,
    lang,
  };
});
