import { useApi, usePagination } from '@/composables';
import router from '@/router';
import { CouponApi } from '@/api/Coupon/endpoints';
import type { CouponDto } from '@/api/Coupon/dto';
import { getCouponByIdDto } from '@/api/Coupon/dto';
import { OfferApi } from '@/api/Offer/endpoints';

const { GET, POST, DELETE } = useApi();
const { pagination, paginate } = usePagination()
export const useCouponStore = defineStore('coupon', () => {
  // states  . . .
  const coupons = ref<CouponDto[]>([]);
  const cachedCoupons = ref<CouponDto[]>([]);
  const coupon = ref<getCouponByIdDto>(new getCouponByIdDto());
  const error = ref(true);
  const customerOrders = ref<{ name: string; id: string }[]>([])

  const paginateCoupons = computed(<CouponDto>() => {
    return paginate(coupons.value)
  })

  const query = ref('');
  const typeFilter = ref('');

  const pagCount = computed(() => {
    return pagination.value.totalCount = ((coupons.value.length % 8) > 0) ? Math.floor((coupons.value.length / 8)) + 1 : Math.floor((coupons.value.length / 8));
  })

  // Actions . . .

  // searching
  const search = () => {
    // filter();
    coupons.value = coupons.value.filter(item => {
      return item.name.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()) || item.code.toLocaleLowerCase().includes(query.value.toLocaleLowerCase())
    })
  }

  const filter = () => {

    if (typeFilter.value === null) {
      coupons.value = cachedCoupons.value

    }
    else {
      {
        coupons.value = coupons.value.filter(item => {
          return item.offerType === typeFilter.value
        })
      }
    }
  }

  watch(query, () => {
    coupons.value = cachedCoupons.value;
    myFilFunciton()
  })

  watch(typeFilter, () => {
    coupons.value = cachedCoupons.value;
    myFilFunciton();
  })

  const myFilFunciton = () => {

    if (typeFilter.value !== '')
      filter();

    if (query.value !== '')
      search();

  }

  const resetTypes = () => {
    coupons.value = cachedCoupons.value;

    search();
  }

  // get All
  const getAll = async () => {
    try {
      const res = await GET<CouponDto[]>(CouponApi.GetAll, {}, { error: true });

      coupons.value = res.data;
      cachedCoupons.value = res.data;
    }
    catch (error) {
      throw (error)
    }
  }

  // get Names
  const getNames = async () => {
    try {
      // const res = await  . . .
    }
    catch (error) {
      throw (error)
    }
  }

  // get by id
  const getById = async (id: string) => {
    try {
      const res = await GET<getCouponByIdDto>(`${CouponApi.GetById}?Id=${id}`, {}, { error: true });
      coupon.value = res.data;

      return res.data

    }
    catch (error) {

      throw (error)
    }
  }

  // get My Offers
  const getMyOffers = async () => {
    try {
      // const res = await  . . .
    }
    catch (error) {
      throw (error)
    }
  }

  // add New Coupon
  const addCoupon = async () => {
    let obj = {};
    if (coupon.value.offerType === 'Branch') {
      // delete coupon.value.productIds;
      // delete coupon.value.customerId;
      const { productsIds, customerId, ...otherProps } = coupon.value;

      obj = otherProps;

    }
    else if (coupon.value.offerType === 'Products') {
      // delete coupon.value.customerId;
      const { customerId, ...otherProps } = coupon.value;

      obj = otherProps;
    }
    else if (coupon.value.offerType === 'Customer') {
      // delete coupon.value.productIds;
      // delete coupon.value.branchId
      const { productsIds, branchId, ...otherProps } = coupon.value;

      obj = otherProps;
    }
    try {
      const res = await POST(CouponApi.AddCoupon, { ...obj }, { success: 'تم اضافة الحسم بنجاح ', error: true });
      if (res?.status === 200)
        error.value = false;

      coupons.value.unshift(res?.data);
    }
    catch (error) {
      throw (error)
    }
  }

  // Modify
  const modify = async () => {
    try {
      const res = await POST(CouponApi.Modify, { ...coupon.value }, { success: 'تم التعديل بنجاح !', error: true })
    }
    catch (error) {
      throw (error)
    }
  }

  // Delete
  const deleteCoupon = async (id: string) => {
    try {
      const res = await DELETE(`${CouponApi.Delete}?id=${id}`, [], { success: 'تم الحذف بنجاح', error: true })

      router.push({ path: '/setting/coupons' })
    }
    catch (error) {
      throw (error)
    }
  }

  // Get OFFERS Names
  const GetOffersNames = async (customerId: string) => {
    const { data } = await GET<{ name: string, id: string }[]>(OfferApi.GetNames, { id: customerId });

    return data;
  }

  return { error, resetTypes, typeFilter, customerOrders, query, pagination, paginateCoupons, pagCount, coupons, coupon, getAll, getNames, getMyOffers, getById, addCoupon, modify, deleteCoupon, GetOffersNames };
})
