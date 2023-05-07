import type {
  DeliveryPricing,
  GetAll,
  CityWithArea,
  GetAllArea,
  ShopCategories,
} from '@/api/setting/dto';
import { LinkDto, SystemStandar, AddCategoryDto } from '@/api/setting/dto';
import { SettingApi } from '@/api/setting/endpoints';
import { useApi } from '@/composables/index';
import { defineStore } from 'pinia';
import { usePagination } from '../composables/usePagination';

export const useSettingStore = defineStore('Setting', () => {
  const { GET, POST, DELETE } = useApi();
  const cityWithArea = ref<CityWithArea[]>([]);
  const citiesList = ref<GetAll[]>([]);
  const shopCategories = ref<ShopCategories[]>([]);
  const labels = ref<GetAll[]>([]);
  const areas = ref<GetAllArea[]>([]);
  const pricings = ref<DeliveryPricing[]>([]);
  const users = ref<GetAll[]>([]);
  const links = ref<LinkDto[]>([]);
  const addCategoryDto = ref<AddCategoryDto>(new AddCategoryDto());
  const linkDto = ref<LinkDto>(new LinkDto());
  const lang = ref('ar');
  const cityDto = ref({
    name: '',
    id: '',
  });
  const labelDto = ref({
    name: '',
    id: '',
  });
  const areaDto = reactive({
    id: '',
    name: '',
    cityId: '',
  });

  const modifyPricingDto = ref<{
    id: string
    extraTime: number
    price: number
  }>({
    id: '',
    extraTime: 0,
    price: 0,
  });

  const systemDto = ref(new SystemStandar());

  // TODO GETTERS
  const areaName = computed(
    () => (areaId: string) => areas.value.find(a => a.id === areaId)?.name,
  );
  const cityName = computed(
    () => (areaId: string) => areas.value.find(a => a.id === areaId)?.name,
  );

  // Get Settings
  async function GetAllSettings() {
    try {
      const response = await GET<SystemStandar>(SettingApi.Get);
      systemDto.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get All cities
  async function GetAllCities() {
    try {
      const response = await GET<GetAll[]>(SettingApi.GetAllCities, {
      },
      {
        error: true,
      },
      { headers: { lang: lang.value } });
      citiesList.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // upsert cities
  async function UpsertCity(payload: { name: string; id?: string }) {
    try {
      const response: any = await POST(
        SettingApi.UpsertCity,
        payload,
        { success: true },
        { headers: { lang: lang.value } },
      );
      if (payload.id) 
GetAllCities();
      else citiesList.value.unshift(response.data);

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get cityWithAreas
  async function GetCitiesWithArea() {
    try {
      const response = await GET<CityWithArea[]>(
        SettingApi.GetAllCitiesWithAreas,
      );
      cityWithArea.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get Shop Categories
  async function GetAllShopCategories() {
    try {
      const response = await GET<ShopCategories[]>(
        SettingApi.GetAllShopCategory,
        {
        },
        {
          error: true,
        },
        { headers: { lang: lang.value } });
      shopCategories.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // ADD Shop Category
  async function AddCategoryShop(payload: {
    name: string
    imageFile: null | File
  }) {
    try {
      const response: any = await POST(
        SettingApi.AddShopCategory,
        payload,
        { success: 'تمت الاضافة بنجاح' }, 
        { formData: true, headers: { lang: lang.value } },
        
      );
      shopCategories.value.unshift(response.data);

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Modify Shop Category
  async function ModifyCategoryShop(payload: {
    id: string
    name: string
    imageFile: null | File
  }) {
    try {
      const response = await POST(
        SettingApi.ModifyShopCategory,
        payload,
        { success: 'تمت تعديل بنجاح' },
        { formData: true, headers: { lang: lang.value } },
      );
      GetAllShopCategories();

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get Labels
  async function GetAllLabels() {
    try {
      const response = await GET<GetAll[]>(SettingApi.GetAllLabels, {
      },
      {
        error: true,
      },
      { headers: { lang: lang.value } });
      labels.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Upsert Labels
  async function UpsertLabels(payload: { name: string; id?: string }) {
    try {
      const response: any = await POST(
        SettingApi.UpsertLabel,
        payload,
        { success: 'تمت الاضافة بنجاح' },
        { headers: { lang: lang.value } },
      );
      if (payload.id) 
GetAllLabels();
      else labels.value.unshift(response.data);

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get Areas
  async function GetAllAreas() {
    try {
      const response = await GET<GetAllArea[]>(SettingApi.GetAllAreas, {
      },
      {
        error: true,
      },
      { headers: { lang: lang.value } });
      areas.value = response.data;
      console.log(areas.value);

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Upsert Areas
  async function UpsertAreas(payload: {
    name: string
    cityId: string
    id?: string
  }) {
    try {
      const response: any = await POST<
        GetAllArea,
        { name: string; cityId: string; id?: string }
      >(
        SettingApi.UpsertArea,
        payload,
        { success: 'success' },
        { headers: { lang: lang.value } },
      );
      if (payload.id) 
GetAllAreas();
      else areas.value.unshift(response.data);

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get customer link
  async function GetAllLinks() {
    try {
      const response = await GET<LinkDto[]>(SettingApi.GetCustomerLinks);
      links.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Upsert cutsomer link
  async function UpsertCustomers(payload: { name: string; link: string }) {
    try {
      const response: any = await POST(SettingApi.UpsertCustomerLink, payload, {
        success: 'تمت الاضافة بنجاح',
      });
      links.value.unshift(response.data);

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get Areas Price
  async function GetAllAreasPrices() {
    try {
      const response = await GET<DeliveryPricing[]>(
        SettingApi.GetAllAreasPrices,
      );
      pricings.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Modify Areas Price
  async function ModifyAreasPrices(payload: any) {
    try {
      const response = await POST(
        SettingApi.ModifyAreaPrice,
        {
          ...payload,
          price: parseInt(payload.price),
          extraTime: parseInt(payload.extraTime),
        },
        { success: 'تم التعديل بنجاح' },
      );
      GetAllAreasPrices();

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // Get user
  async function GetAllUsers() {
    try {
      const response = await GET<GetAll[]>(SettingApi.GetAllAreasPrices);
      users.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // modify settings
  async function ModifySetting(payload: SystemStandar) {
    try {
      const response = await POST(SettingApi.Modify, payload, {
        success: 'تم التعديل بنجاح',
      });
      systemDto.value = { ...payload };

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // delete shoop categories
  async function DeleteShopCategories(ids: any) {
    try {
      const response = await DELETE(SettingApi.DeleteShopCategory, ids);
      shopCategories.value = shopCategories.value.filter(
        ele => !ids.includes(ele.id),
      );

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // delte area
  async function DeleteAreas(ids: any) {
    try {
      const response = await DELETE(SettingApi.DeleteArea, ids);
      areas.value = areas.value.filter(ele => !ids.includes(ele.id));

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // delte Labels
  async function DeleteLabels(ids: any) {
    try {
      const response = await DELETE(SettingApi.DeleteLabels, ids);
      labels.value = labels.value.filter(ele => !ids.includes(ele.id));

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // delte cities
  async function DeleteCities(ids: any) {
    try {
      const response = await DELETE(SettingApi.DeleteCity, ids);
      citiesList.value = citiesList.value.filter(
        ele => !ids.includes(ele.id),
      );

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }
  watch(lang, () => {
    GetAllCities();
    GetAllAreas();
    GetAllLabels();
    GetAllShopCategories();
  });

  return {
    areaName,
    areaDto,
    labelDto,
    cityDto,
    cityName,
    GetCitiesWithArea,
    GetAllCities,
    cityWithArea,
    citiesList,
    GetAllUsers,
    DeleteCities,
    links,
    UpsertCustomers,
    GetAllLinks,
    linkDto,
    DeleteLabels,
    ModifyCategoryShop,
    modifyPricingDto,
    DeleteAreas,
    DeleteShopCategories,
    ModifyAreasPrices,
    UpsertLabels,
    UpsertCity,
    UpsertAreas,
    AddCategoryShop,
    addCategoryDto,
    ModifySetting,
    users,
    systemDto,
    areas,
    pricings,
    labels,
    GetAllLabels,
    GetAllAreasPrices,
    GetAllAreas,
    shopCategories,
    GetAllShopCategories,
    GetAllSettings,
    lang,
  };
});
