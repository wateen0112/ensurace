import { AddDriverDto, GetAllDriversDto,GetDriverByIdDto } from '@/api/Driver/dto';
import { GetAllDriverFilters } from '@/api/Driver/dto';
import router from '@/router';
import { DriverApi } from '@/api/Driver/endpoints';
import { useApi, usePagination } from '@/composables/index';
import { defineStore } from 'pinia';
const startDate = ref('');
const endDate = ref('');
const query = ref('');
const status = ref('');
const searchRef= ref();
const error = ref (true);
const { pagination, paginate } = usePagination()

export const useDriverStore = defineStore('Driver', () => {
  const { GET, DELETE ,POST} = useApi();
const driverDto = ref(new AddDriverDto() );
const getDriverByIdDto = ref(new GetDriverByIdDto())
  const drivers = ref<GetAllDriversDto[]>([]);
const cashedDrivers = ref<GetAllDriversDto[]>([]);
 


  const paginateDrivers = computed(<AddDriverDto>() => {
    return paginate(drivers.value);
  });

  const PagCount = computed(() => {
    return pagination.value.totalCount =((drivers.value.length % 8) > 0) ?Math.floor( (drivers.value.length / 8) )+ 1 : Math.floor((drivers.value.length / 8));
  },
  
  )
  const ordersPagCount = computed(() => {
    return pagination.value.totalCount =((getDriverByIdDto.value.orderPagination.count % 8) > 0) ?Math.floor( (getDriverByIdDto.value.orderPagination.count/ 8) )+ 1 : Math.floor((getDriverByIdDto.value.orderPagination.count / 8));
  },)

  const search = () => {
  
    drivers.value = drivers.value.filter((item: any) => {
      return item.name.toLowerCase().includes(query.value.toLowerCase());
    })
  }

  const statusFilter = () => {

    console.log(status.value);
    if (status.value !== '') {
      drivers.value = drivers.value.filter((item: any) => {
        return item.driverStatus ===status.value
      })
   
    }
  }

  const dateFilterd = () => {

if(startDate.value&&endDate.value){
  
  const startArray = startDate.value.split('T') [0].split('-');
  const endArray = endDate.value.split('T') [0].split('-');

  drivers.value = drivers.value.filter((item: any) => {
    const itemArr =item.dateCreated.split('T') [0].split('-');

    const startValue = parseFloat(startArray[0]) + parseFloat(startArray[1]) * 0.1 + parseFloat(startArray[2]) * 0.01;
    const endValue = parseFloat(endArray[0]) + parseFloat(endArray[1]) * 0.1 + parseFloat(endArray[2]) * 0.01;
    const itemValue = parseFloat(itemArr[0]) + parseFloat(itemArr[1]) * 0.1 + parseFloat(itemArr[2]) * 0.01;
console.log("Start Date : ", startValue ,"Item Date : ", itemValue , "Item Date :  ",endValue );

    return (
      startValue <= itemValue && endValue >= itemValue

    )
  })
;
}
  }

  const filterFunciton = () => {
    drivers.value = cashedDrivers.value;
  
    
    if (status.value !== '')
    statusFilter();
    if (startDate.value !== '' && endDate.value !== '')
    dateFilterd();
    if (query.value !== '')
    search();
  }

  const filterReset = () => {

    startDate.value = "";
    endDate.value ="";
    query.value ="";
    status.value = "";
    
    drivers.value = cashedDrivers.value;
  }

  watch(startDate, () => {
  if(startDate.value!==null){
      if ((startDate.value !== '' && endDate.value !== ''))
    filterFunciton()
  }
  });


  watch(endDate, () => {
  if (endDate.value!==null){
    if (startDate.value !== '' && endDate.value !== '')
    filterFunciton()
  }
  })

  watch(query, () => {
    filterFunciton ();
  })

  watch(status, () => {
    if (!status.value)
      status.value = ''
    filterFunciton()
  })

  const getAllDrivers = async () => {
    try {
      const res = await GET<GetAllDriversDto[]>(DriverApi.GetAll,
        {},{error:true}
      );

      cashedDrivers.value = res.data;
      drivers.value = res.data

      pagination.value.totalPages = res.data.length;
      pagination.value.totalPages = drivers.value.length;
 

  
       
    ;
    }

    catch (e) {

    }
  }

  const deleteDrivers = async (items: string[]) => {
console.log('MY items are  :',items);

    try {
      const res = await DELETE(DriverApi.Delete,items ,{success:"تم الحذف بنجاح",error:true})

      items.forEach (item => {
        drivers.value=  drivers.value.filter(element => {
          return element.id !== item
        })
router.go(-1);
      })
    }
    catch (error) {
      console.log(error);
    }
  }

const getById = async (id: string) => {
  try {
    const res = await GET<GetDriverByIdDto>(`${DriverApi.GetById}?id=${id}&PageSize=1&PageIndex=1`,{error:true});

    getDriverByIdDto.value = res.data;

  }
 catch (error) {

  }
}
const addDriver = async <AddDriverDto> (dto :AddDriverDto)=>{
console.log("My Dto", dto);

  try {
  const res = await POST(DriverApi.Add , {...dto},{success:` تمت اضافة السائق  `,error:true},{formData:true});

  drivers.value.push(res?.data)
  
;
console.log('damn response : ',res?.status);

if (res?.status===200){
  error.value=false
}
else {
  error.value=true
}
} catch (err) {

throw err;  
}
}
const modify  = async()=>{
  try {
    const res = await POST(DriverApi.Modify,{...getDriverByIdDto.value.driver},{success:"تم التعديل بنجاح",error:true},{
      formData:true
    });
    // // getById(getDriverByIdDto.value.driver.id)
    
  } catch (error) {
    throw(error);
  }
}
  return {error,modify,cashedDrivers,getDriverByIdDto,addDriver, getById, status, query, endDate, startDate, statusFilter, filterReset, search, PagCount, pagination, driverDto, paginateDrivers, getAllDrivers, drivers, deleteDrivers, dateFilterd }
})
