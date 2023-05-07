import { useApi } from "@/composables"
import { emApi } from "@/api/Emergency/endpoints"
import { EmergencyDto ,getEmrByIdDto,ReplyDto} from "@/api/Emergency/dto"
import { usePagination } from "@/composables";

const {GET,POST,DELETE} = useApi()
export const useEStore = defineStore('Emergency',()=>{
 
//states  . . . 
const emrs  = ref<EmergencyDto[]>([]);
const dialog = ref(false)
const notificationId  = ref('');
const {paginate,pagination} = usePagination();
const emr   = ref<getEmrByIdDto>(new getEmrByIdDto());
const  reply = ref<ReplyDto>(new ReplyDto())
const query = ref('');
const PagCount = computed(() => {
  return pagination.value.totalCount =((emrs.value.length % 8) > 0) ?Math.floor( (emrs.value.length / 8) )+ 1 : Math.floor((emrs.value.length / 8));
},)
const paginateEmrs = computed(() => {
  return paginate(emrs.value);
});
const startDate = ref('');
const endDate   = ref('');
const cachedEmrs = ref<EmergencyDto[]>([]);
//acitons  . . .  
//get all
const getAll= async ()=>{
  try {
    const res = await  GET<EmergencyDto[]>(emApi.GetAll ,{startDate:startDate.value ,endDate:endDate.value},{error:true});
    emrs.value= res.data;
    cachedEmrs.value= res.data;
    
    // pagination.value.totalPages = 10;
    // pagination.value.totalPages = emrs.value.length;

  } catch (error) {
    throw(error)

  }
}

// get by id . . .  
const getById  = async(id:string)=>{
  try {
    const res = await GET<getEmrByIdDto>(emApi.GetById+`?id=${id}`,{},{error:true});
    emr.value= res.data;
  } catch (error) {
    throw(error)
  }
}
//handel  .. . . 
const handel = async  (  )=>{
try {
  const res = await POST(emApi.Handle,{...reply.value},{error:true , success:'تم التعامل مع الرسالة بنجاح'})
  
} catch (error) {
  throw(error);
}
}
//delete . . . 
const deleteEmr =async (id:string)=>{
try {
  const res = await POST(emApi.Delete+`?id=${id}`,{},{success:'تم الحذف بنجاح', error:true});
} catch (error) {
  throw(error)
}
}
return {notificationId,PagCount,paginateEmrs,pagination,dialog,getAll,emrs , emr , getById,handel,deleteEmr,reply,query , startDate , endDate}
})
