import type { GetAllAdvert } from '@/api/Advert/dto';
import { AdvertApi } from '@/api/Advert/endpoint';
import { useApi } from '@/composables/index';
import { defineStore } from 'pinia';
import { AddAdvert as AddAdvertDto, GetDetailsAdvert as DetailsAdvertDto } from '@/api/Advert/dto';

export const useAdvertStore = defineStore('Advert', () => {
  const { GET, POST, DELETE } = useApi();
  const AdvertList = ref<GetAllAdvert[]>([]);
  const List = ref<GetAllAdvert[]>([]);
  const advertDto = ref(new AddAdvertDto());
  const advertDetailsDto = ref(new DetailsAdvertDto())
  const searchList = ref('')

  // Get All Advert
  async function GetAllAdverts() {
    try {
      const response = await GET<GetAllAdvert[]>(AdvertApi.GetAll);

      AdvertList.value = response.data;
      List.value = response.data;

      return response;
    }
    catch (er) {
          console.log('ERROR FOLDER', er);
        }
  }

  // Get Details Advert
  async function GetDetailsAdvert(id: any) {
    const response: any = await GET<DetailsAdvertDto>(
      AdvertApi.GetById + id,
    );

    advertDetailsDto.value = response.data;
    console.log(response);
  }

  // Add Advert
  async function AddAdvert(payload: any) {
    const response = await POST(AdvertApi.Add, payload, {
      error: true,
      success: 'تمت الاضافة بنجاح',
    }, { formData: true },
    );

    AdvertList.value?.unshift(payload);

    console.log(response);
  }

  // Modify Advert
  async function ModifyAdvert(payload: any) {
    const response = await POST(AdvertApi.Modify, payload, {
      error: true,
      success: 'تم التعديل  بنجاح',
    }, { formData: true },
    );

    advertDetailsDto.value = { ...response.data };
  }

  // Delete Advert
  async function DeleteAdvert(ids: string[]) {
    await DELETE(AdvertApi.Delete, ids);

    AdvertList.value = AdvertList.value?.filter(
      (item: any) => !ids.includes(item.id),
    );
  }
  const search = () => {
    AdvertList.value = AdvertList.value.filter((el: any) => {
      return el.name
        .toLowerCase()
        .includes(searchList.value.toLocaleLowerCase());
    });
    
  }
  const filter = () => {
     AdvertList.value = List.value;
    if (searchList.value !== '')
      search()
  }

  watch(searchList, () => {
    filter();
  });

  return {
    GetAllAdverts,
    AdvertList,
    advertDto,
    AddAdvert,
    GetDetailsAdvert,
    advertDetailsDto,
    ModifyAdvert,
    DeleteAdvert,
    searchList,
  };
});
