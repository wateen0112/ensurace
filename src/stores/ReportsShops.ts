import type { AllShops, ShopsDto } from '@/api/Reports/Shops/dto';
import { ReportsApi } from '@/api/Reports/endpoints';
import { useApi, usePagination } from '@/composables/index';
import { defineStore } from 'pinia';
import { GetAllSopsFilters } from '@/api/Reports/Shops/dto';


export const useReportsStore = defineStore('ReportsStore', () => {
  const { GET } = useApi();
  const { pagination } = usePagination();
  const shopsList = ref<AllShops[]>([]);
  const tempList = ref<AllShops[]>([]);
  const shops = ref<AllShops[]>([]);
  const filterDto = ref<GetAllSopsFilters>(new GetAllSopsFilters());
  const searchShops = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const filters = ref('');
 

  // async function ExportShopsToExcel(filter: any) {
  //   try {
  //     const response = await GET<ShopsDto>(ReportsApi.GetExportShops + filter, {
  //       ...filterDto,
  //       ...pagination.value,
  //     });

  //     shopsList.value = response.data.shops;
  //     tempList.value = response.data.shops;
  //     pagination.value.totalCount = response.data.count;

  //     return response;
  //   } catch (er) {
  //     console.log("ERROR", er);
  //   }
  // }
    const GetBranchesReports=async()=> {

    try {
      const response = await GET<ShopsDto>(
        ReportsApi.GetShops,
        {
          ...filterDto.value,
          ...pagination.value,
          OrderBy: filters.value,
          Search: searchShops.value,
        },
      );
        console.log(response);
        

      shopsList.value = response.data.shops;
      tempList.value = response.data.shops;
      pagination.value.totalCount = response.data.count;

      return response;
    }
    catch (er) {
      console.log('ERROR', er);
    }
  }
  // const dateFilterd = () => {
  //   if (startDate.value && endDate.value) {
  //     const startArray = startDate.value.split('T')[0].split('-');
  //     const endArray = endDate.value.split('T')[0].split('-');

  //     shopsList.value = shopsList.value.filter((item: any) => {
  //       const itemArr = item.dateCreated.split('T')[0].split('-');

  //       const startValue
  //         = parseFloat(startArray[0])
  //         + parseFloat(startArray[1]) * 0.1
  //         + parseFloat(startArray[2]) * 0.01;
  //       const endValue
  //         = parseFloat(endArray[0])
  //         + parseFloat(endArray[1]) * 0.1
  //         + parseFloat(endArray[2]) * 0.01;
  //       const itemValue
  //         = parseFloat(itemArr[0])
  //         + parseFloat(itemArr[1]) * 0.1
  //         + parseFloat(itemArr[2]) * 0.01;

  //       return startValue <= itemValue && endValue >= itemValue;
  //     });
  //   }
  // };

  // const filterFunciton = () => {
  //   shopsList.value = tempList.value;
  //   if (startDate.value !== '' && endDate.value !== '') 
  //   dateFilterd();
  // };
 
  // watch(startDate, () => {
  //   if (startDate.value !== null) {
  //     if (startDate.value !== '' && endDate.value !== '') 
  //       filterFunciton();
  //     }
    
  // });

  // watch(endDate, () => {
  //   if (endDate.value !== null) {
  //     if (startDate.value !== '' && endDate.value !== '') 
  //       filterFunciton();
  //     }
    
  // });

  // watch(searchShops, () => {
  //   filterFunciton();
  // });


  return {
    GetBranchesReports,
    shopsList,
    shops,
    filters,
    startDate,
    endDate,
    searchShops,
    pagination,
  };
});
