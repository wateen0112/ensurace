import { GetSubscriptionByIdDto, SubscribtionDto, Branch } from "@/api/Subscription/dto"
import { SubscriptionApi } from "@/api/Subscription/endpoints";
import { useApi, usePagination } from "@/composables";

import router from "@/router";
const { GET, POST, DELETE } = useApi();
const { pagination, paginate } = usePagination()
export const useSubStore = defineStore('subscription', () => {
  //States  . . . 
  const subs = ref<SubscribtionDto[]>([]);
  const cachedSubs = ref<SubscribtionDto[]>([]);
  const paginateSubs = computed(<SubscribtionDto>() => {
    return paginate(subs.value)
  });

  const PagCount = computed(() => {
    return pagination.value.totalCount = ((subs.value.length % 8) > 0) ? Math.floor((subs.value.length / 8)) + 1 : Math.floor((subs.value.length / 8));
  },
  )
const error =ref(true);
  const query = ref('');
  const sub = ref<GetSubscriptionByIdDto>(new GetSubscriptionByIdDto());

  const branchesPaginations = computed(<Branch>() => {
    return paginate(sub.value.branches)
  })
  const brachPageCount = computed(() => {
    return pagination.value.totalCount = ((sub.value.branches.length % 8) > 0) ? Math.floor((sub.value.branches.length / 8)) + 1 : Math.floor((sub.value.branches.length / 8))
      ;
  })
  // Actions   . . . 

  //Getting all data 
  const getAll = async () => {
    try {
      const res = await GET<SubscribtionDto[]>(SubscriptionApi.GetAll, {}, { error: true });
      subs.value = res.data;
      cachedSubs.value = res.data;
    } catch (error) {
      throw (error);
    }
  }
  const search = () => {
    subs.value = cachedSubs.value;
    subs.value = subs.value.filter((item: any) => {
      return item.name.toLowerCase().includes(query.value.toLowerCase());
    })
  }
  watch(query, () => {
    search();
  })
  //Get by Id
  const getById = async (id: string) => {
    try {
      const res = await GET<GetSubscriptionByIdDto>(SubscriptionApi.GetById + `?id=${id}`, {}, { error: true });
      sub.value = res.data;
    } catch (error) {
      throw (error);
    }
  }
  // Add new One  
  const addSubscription = async (dto: SubscribtionDto) => {
    try {

      const res = await POST(SubscriptionApi.Add, dto, { success: 'تم الإضافة بنجاح', error: true });
      subs.value.push(res?.data);
      if (res?.status===200){
        error.value=false
      }
    } catch (error) {
      throw (error);
    }
  }
  //Modify 
  const modify = async () => {
    try {
      const res = await POST(SubscriptionApi.Modify, sub.value, { success: 'تم التعديل بنجاح', error: true });
    } catch (error) {
      throw (error);
    }
  }
  //Add A new  Branch  s
  const addBranch = async (ob: any) => {
    try {
      const res = await POST(SubscriptionApi.AddBranch, ob, { success: 'تم إضافة فرع جديد بنجاح', error: true })
      sub.value.branches.push(res?.data);
      sub.value.branchesCount++;
    } catch (error) {
      throw (error);
    }
  }
  //Delete a Sub 
  const deleteSub = async (id: string) => {

    try {
      const res = await DELETE(SubscriptionApi.Delete + `?id=${id}`, [], { success: 'تم الحذف بنجاح', error: true });
      subs.value = subs.value.filter((item: any) => {
        return item !== id;
      })
      router.push({ path: '/content-management/subscriptions' })
    } catch (error) {
      throw (error);
    }
  }
  const deleteBranch = async (ids: any) => {
    try {
      const res = await DELETE(SubscriptionApi.DeleteBranch, [...ids], { success: 'تم حذف الفرع بنجاح !', error: true });
      getById(sub.value.id)
    } catch (error) {
      throw (error);
    }
  }
  return { error,deleteBranch, subs, brachPageCount, branchesPaginations, query, pagination, PagCount, sub, paginateSubs, getAll, getById, modify, deleteSub, addBranch, addSubscription };

})
