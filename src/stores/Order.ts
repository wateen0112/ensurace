import {
  ConfirmBranshDTO,
  GetAllOrdersFilters,
  ConfirmAddDTO,
  OrderDetailDto,
} from '@/api/Order/dto';
import type {
  GetConfirmDriverDTO,
  GetConfirmedOrderDTO,
  OrderCart,
  ExpectedReceiveDate,
  GetAllOrderDTO,
  OrderItem,
  OrderShopsItemDTO,
  CartItem,
  Driver,

  ConfirmedOrderBranshes,
} from '@/api/Order/dto';
import { useNotificationStore } from './Notification';
import { BranchCategoryApi } from '@/api/BranchCategory/endpoints';
import type { CustomerSearchDTO } from '@/api/Customer/dto';
import type { CategoryWithProducts } from '@/api/Product/dto';
import { OrderApi } from '@/api/Order/endpoints';
import { useApi, usePagination } from '@/composables/index';
import { Order_Status } from '@/enums/OrderStatus';
import { defineStore } from 'pinia';
import { useSettingStore } from './Setting';
import { OrderCartApi } from '@/api/OrderCart/endpoints';
import type { CalcInvoiceDTO, InvoiceDTO } from '@/api/OrderCart/dto';

import Swal from 'sweetalert2';
import { Order_Stage } from '@/enums/OrderStage';
import { AxiosError } from 'axios';

export const useOrderStore = defineStore('order', () => {
  const notificationStore = useNotificationStore()
  const router = useRouter();
  const route = useRoute();
  const setting = useSettingStore();
  const { pagination } = usePagination();
  const { GET, POST, DELETE } = useApi();
  const orders = ref<OrderItem[]>([]);
  const AllOrders = ref<OrderItem[]>([]);
  const offers = ref<{ name: string; id: string }[]>([])
  const filterDto = ref<GetAllOrdersFilters>(new GetAllOrdersFilters());
  const orderStatusOptions = ref([
    { name: 'غير مؤكد', value: Order_Status.UnConfirmed },
    { name: 'ملغي', value: Order_Status.Cansel },
    { name: 'تم التسليم', value: Order_Status.Done },
    { name: ' مرتجع', value: Order_Status.RollBack },
    { name: 'قيد التجهيز', value: Order_Status.InProcess },
    { name: 'في الطريق', value: Order_Status.OnWay },
  ]);
  const categoriesWithProducts = ref<CategoryWithProducts[]>([]);

  // const customerOrderDto = ref<OrderDetailDto>(new OrderDetailDto())
  const loader = ref(false);
  const shopTab = ref('');
  const isRollBack = ref(false);
  const isDialogUnconifermOrder = ref(false);
  const searchOrder = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const fiterOrder = ref('');
  const branchesToReceive = ref<{ branchId: string; isReceived: boolean }>([])
  interface HandlerOrderType {
    employeeName: string
    dateTime: string
  }

  const handleOrderDto = ref<HandlerOrderType>({
    employeeName: '',
    dateTime: '',
  });

  // order type and status
  const orderStatus = ref<{ value: string; status: string; color: string }[]>([
    {
      status: 'UnConfirmed',
      value: 'غير مؤكد',
      color: 'info',
    },
    {
      status: 'Confirmed',
      value: 'مؤكد',
      color: 'success',
    },
    {
      status: 'NewOrder',
      value: 'طلب جديد',
      color: 'info',
    },
    {
      status: 'InProcess',
      value: 'قيد المعالجة',
      color: 'info',
    },
    {
      status: 'OnWay',
      value: 'في الطريق',
      color: 'info',
    },
    {
      status: 'Done',
      value: 'تم التسليم',
      color: 'success',
    },
    {
      status: 'Cansel',
      value: 'تم الغاء ',
      color: 'error',
    },
    {
      status: 'RollBack',
      value: 'تم تراجع ',
      color: 'primary',
    },
  ]);

  const orderType = ref<{ value: string; type: string }[]>([
    {
      value: 'مسبق',
      type: 'Prior',
    },
    {
      value: 'فوري',
      type: 'Instant',
    },
  ]);

  // CREATE ORDER STATE
  const invoiceDto = ref({
    invoiceUrl: '',
    invoiceFile: null,
  });
  const orderShopsList = ref<OrderShopsItemDTO[]>([])
  const selectedAddress = ref('')
  const selectedShop = ref<OrderShopsItemDTO>()
  const confirmOrderDto = ref<ConfirmAddDTO>(new ConfirmAddDTO())
  const customerData = ref<CustomerSearchDTO>({
    addresses: [],
    cityId: '',
    id: '',
    name: '',
    orders: [],
    phoneNumber: '',
    orderNumber: 0,
    address: '',
    addressId: '',
  });

  const orderInvoice = ref<InvoiceDTO>({
    coast: 0,
    deliveryCoast: 0,
    discount: 0,
    orderCartsCount: 0,
    tax: 0,
    total: 0,
  });

  const orderCartProducts = ref<CartItem[]>([]);
  const confrimBranshDto = ref(new ConfirmBranshDTO());

  // Confirm Driver state
  const driversList = ref<Driver[]>([]);

  const isPrior = ref(false);
  const selectedDriver = ref('');
  const expectedReceiveDates = ref<ExpectedReceiveDate[]>([]);

  const getAreaName = (id: string) =>
    setting.areas.find(a => a.id === id)?.name;

  // orderDetailDto
  const orderDetailDto = ref(new OrderDetailDto());

  // ? Getters

  const orderFilterParams = computed(() => ({
    ...filterDto.value,
    ...pagination.value,
  }));

  const currentOrderAreaID = computed(
    () =>
      orderShopsList.value.find(
        sh =>
          orderCartProducts.value.length > 0
          && sh.id === orderCartProducts.value[0].branchId,
      )?.areaId || '',
  );

  const orderId = computed(() => route.params.id as string)

  const isConfirmedOrder = computed(() => route.query.isConfirmedOrder === '1');


  const addresses = computed(() =>
    customerData.value?.addresses.map(a => {
      if (a.dormitoryAddress) {
        return {
          id: a.id,
          text: `${getAreaName(a.areaId)} - ${a.name} - الوحدة : ${a.dormitoryAddress.numberNum
            } - الغرفة : ${a.dormitoryAddress.roomNum}`,
        };
      }

      else if (a.residentialAddress) {
        return {
          id: a.id,
          text: `${getAreaName(a.areaId)} - ${a.name} -${a.residentialAddress.street} `,
        };

      }

      else {
        return { text: a.name, id: a.id };
      }
    }),
  );


  const selectedShops = computed(() =>
    orderShopsList.value.filter(s =>
      orderCartProducts.value.some(p => p.branchId === s.id),
    ),
  );

  const branchesDtoList = computed(() =>
    selectedShops.value.map(s => ({
      id: s.id,
      orderCarts: orderCartProducts.value
        .filter(p => p.branchId === s.id)
        .map(
          item =>
          ({
            branchId: s.id,
            note: item.note,
            productExtraItemIds: item.productExtraItems
              ? item.productExtraItems.map(e => e.id)
              : [],
            productId: item.id,
            quantity: item.quantity,
          } as OrderCart),
        ),
    })),
  );

  const canFinishOrder = computed(() => selectedShops.value.length > 0);



  // ? Actions


  interface modifyCartDto {
    orderId: string
    productId: string
    quantity: number
    note: string
  }

  const modifyRemoteCart = async (payload: modifyCartDto) => {
    return POST<InvoiceDTO, any>(OrderCartApi.Modify, {
      orderId: payload.orderId as string,
      productId: payload.productId,
      quantity: payload.quantity,
      note: payload.note,
    }).then(({ data }) => {
      invoiceDto.value = { ...data }
    })
  }


  const addToRemoteCart = async (payload: modifyCartDto & { productExtraItems: string[] }) => {
    return POST<InvoiceDTO, OrderCart & { orderId: string }>(OrderCartApi.Add, {

      orderId: payload.orderId as string,
      note: payload.note,
      productExtraItemIds: payload.productExtraItems,
      productId: payload.productId,
      quantity: payload.quantity,

    }).then(({ data }) => {
      invoiceDto.value = { ...data }
    })
  }


  function AddProductToCart(product: CartItem) {

    const exictedProduct = orderCartProducts.value.find(p => p.id === product.id);

    const addLocal = () => {
      if (exictedProduct)
        exictedProduct.quantity++;
      else orderCartProducts.value.push({ ...product });
    }

    if (route.query.stage === Order_Stage.Confirmed) {
      if (exictedProduct) {
        modifyRemoteCart({
          note: product.note,
          orderId: orderId.value,
          productId: product.id,
          quantity: +exictedProduct.quantity + 1,
        }).then(() => { addLocal() })
      }

      else {
        addToRemoteCart({
          note: product.note,
          orderId: orderId.value,
          productExtraItems: product.productExtraItems?.map(e => e.id) as string[],
          productId: product.id,
          quantity: product.quantity,
        }).then(() => { addLocal() })
      }

    }
    else {
      addLocal()
    }


  }

  function removeCartItem(itemId: string) {
    orderCartProducts.value = orderCartProducts.value.filter(
      item => item.id !== itemId,
    );
  }

  function setCartItemQuantity(itemId: string, value: number) {
    const product = orderCartProducts.value.find(item => item.id === itemId);

    if (product && +value > 0) {
      if (route.query.stage === Order_Stage.Confirmed) {
        modifyRemoteCart({
          note: product.note,
          orderId: orderId.value,
          productId: product.id,
          quantity: value,
        }).then(() => {

          product.quantity = value;
        })
      }
      else {
        product.quantity = value;
      }

    }

  }

  // TODO  to replace everyForEach

  function fillCart(branches: ConfirmedOrderBranshes[]) {
    orderCartProducts.value = [];
    orderShopsList.value = []
    branches.forEach(b => {
      orderShopsList.value.push({
        isOnline: true,
        hasDeliveryService: true,
        name: b.name,
        id: b.id,
        isConfirmed: b.isConfirmed,
        address: b.address,
        phoneNumber: b.phoneNumber ?? '',
        areaId: b.areaId ?? '',
        receiveDate: b.receiveDate ?? '',
      });

      if (b.billUrl)
        invoiceDto.value.invoiceUrl = b.billUrl
      b.orderCarts.forEach(c => {
        orderCartProducts.value.push({
          branchId: b.id,
          ...c,
        });
      });


    });

  }


  // ! ASYNC Actions

  // get all order
  const GetAllOrder = async (filteres?: any) => {
    loader.value = true;
    try {
      const res = await GET<GetAllOrderDTO>(`${OrderApi.GetAll + filteres}`, {
        ...pagination.value,
        ...filterDto.value,
        Search: searchOrder.value,
        CustomerId: route.params.id,
      });

      orders.value = res.data.orders;
      AllOrders.value = res.data.orders;
      pagination.value.totalCount = res.data.count;
      loader.value = false;
    }
    catch (e) {
      loader.value = false;
    }
  };

  // handler order
  const HandlerOrder = async (id: string) => {

    try {
      const res = await POST<HandlerOrderType | any, { id: string }>(
        OrderApi.Handle,
        { id },
      );
      console.log(res?.data);
      handleOrderDto.value = res?.data;
      notificationStore.ReadNoti(id)

      return res;
    }
    catch (error: any) {
      const handlerEmployee = error.response.data.employeeName
      const handlingDate = new Date(error.response.data.dateTime).toLocaleString()
      notificationStore.ReadNoti(id)

      Swal.fire({
        title: `قام ${handlerEmployee} بمعالجة الطلب مسبقا`,
        text: `هذا الطلب تمت معالجته مسبقا بتاريخ ${handlingDate}`,
        icon: 'info',
      });


    }
  };

  // calc invoice
  const CalcInvoice = async () => {
    if (confirmOrderDto.value.offerId === '')
      confirmOrderDto.value.offerId = null;
    if (canFinishOrder.value) {
      loader.value = true;
      try {
        const res = await POST<InvoiceDTO, CalcInvoiceDTO>(
          OrderCartApi.CalcInvoice,
          {
            areaId: currentOrderAreaID.value,
            branches: branchesDtoList.value,
            customerId: customerData.value.id,
            offerId: confirmOrderDto.value.offerId,
          },
          {
            success: false,
            error: true,
          },
        );
        loader.value = false;
        if (res?.data)
          orderInvoice.value = res?.data;
      }
      catch (er) {
        loader.value = false;
      }
    }
  };

  // confirme driver
  const ConfirmDtiver = async () => {
    if (selectedDriver.value) {
      const res = await POST<
        { id: string; stage: string },
        { driverId: string; id: any }
      >(
        OrderApi.ConfirmDriver,
        {
          id: route.params.id,
          driverId: selectedDriver.value,
        },
        {
          success: 'تم اعلام السائق',
          error: true,
        },
      );
      if (res?.status == 200) {
        router.replace({
          path: `/content-management/orders/stage/OrderDetails/${route.params.id}`,
          query: {
            stage: res?.data.stage,
            isConfirmedOrder: 1,
            tellBranches: 1,
            isConfirmedDriver: 1,
            receivedFromBranches: 0,
            receivedToCustomer: 0,
            rollBack: 0,
          },
        });
      }
    }
    else {
      Swal.fire({
        title: 'يرجى تحديد سائق',
        icon: 'error',
      });
    }
  };

  // confirm branch
  const ConfirmBranch = async (bId: string) => {
    if (!confrimBranshDto.value.estimatedTime) {
      Swal.fire({
        icon: 'error',
        title: 'حدد مدة تحضير الطلب',
        text: 'يرجى تحديد المدة اللازمة من المتجر لتحضير الطلب',
      })

      return;
    }


    if (confirmOrderDto.value.id)
      confrimBranshDto.value.id = confirmOrderDto.value.id;
    confrimBranshDto.value.branchId = bId;


    const confirmedShop = orderShopsList.value.find(sh => sh.id === bId);


    const res = await POST<{ id: string; stage: string }, ConfirmBranshDTO>(
      OrderApi.ConfirmBranch,
      confrimBranshDto.value,
      {
        success: `تم اعلام المتجر ${confirmedShop?.name}`,
        error: true,
        comfirm: false,
      },
    );

    if (confirmedShop)
      confirmedShop.isConfirmed = true;
    if (res?.data.id) {
      confirmOrderDto.value.id = res.data.id;
      confrimBranshDto.value.id = res.data.id;
    }

    confrimBranshDto.value.estimatedTime = ''
    confrimBranshDto.value.note = ''
    if (selectedShops.value.every(s => s.isConfirmed)) {

      router.replace({
        name: 'content-management-orders-stage-ConfirmDriver-id',
        params: { id: confrimBranshDto.value.id },
        query: {
          stage: res?.data.stage,
          isConfirmedOrder: 1,
          tellBranches: 1,
          isConfirmedDriver: 0,
          receivedFromBranches: 0,
          receivedToCustomer: 0,
          rollBack: 0,
        },
      });
    }
  };

  // Confirm received Branch
  const ConfirmReceiveBranch = async () => {
    const res = await POST<
      { id: string; stage: string },
      { id: any; branchId: string }
    >(
      OrderApi.ConfirmReceiveBranch,
      { id: route.params.id, branchId: shopTab.value },
      {
        success: 'تم الاستلام من المتجر',
        error: true,
      },
    );
    console.log(res);
    const received = orderShopsList.value.find(o => o.id === shopTab.value);
    if (received)
      received.receiveDate = new Date().toDateString();

    if ((res?.status === 200 && res.data.stage === Order_Stage.ReceivedFromBranches) || orderShopsList.value.every(s => !!s.receiveDate)) {
      router.replace({
        query: {
          stage: res?.data.stage,
          isConfirmedOrder: 1,
          tellBranches: 1,
          isConfirmedDriver: 1,
          receivedFromBranches: 1,
          receivedToCustomer: 0,
          rollBack: 0,
        },
      });
    }

  };

  // confirm customer
  const ConfirmReceiveCustomer = async () => {
    const res = await POST<{ id: string; stage: string }, { id: any }>(
      OrderApi.ConfirmReceiveCustomer,
      { id: route.params.id },
      {
        success: 'تم تسليم للزبون',
        error: true,
      },
    );
    console.log(res);
    if (res?.status == 200) {
      router.replace({
        query: {
          isConfirmedOrder: 1,
          tellBranches: 1,
          isConfirmedDriver: 1,
          receivedFromBranches: 1,
          receivedToCustomer: 1,
          rollBack: 0,
        },
      });
    }
  };

  // delete order
  const DeleteOrder = async (id: any) => {
    await DELETE(OrderApi.Delete, id);
    router.push('/content-management/orders');
    GetAllOrder(searchOrder);
  };

  // role back
  const RoleBackOrder = async (payload: string) => {
    const res = await POST<
      { id: string; stage: string },
      { id: any; reason: string }
    >(
      OrderApi.RoleBack,
      { id: route.params.id, reason: payload },
      {
        success: 'تم تراجع عن الطلب',
        error: 'فشل التراجع عن الطلب',
      },
    );
    if (res?.status == 200) {
      router.replace({
        query: {
          stage: res?.data.stage,
          isConfirmedOrder: 1,
          tellBranches: 1,
          isConfirmedDriver: 1,
          receivedFromBranches: 1,
          receivedToCustomer: 1,
          rollBack: 1,
        },
      });
      GetUnCompleteOrder();
    }
  };

  // cancel
  const CancelOrder = async (payload: string) => {
    const res = await POST<{ id: string; reason: string }, any>(
      OrderApi.Cancel,
      { id: route.params.id, reason: payload },
      {
        success: 'تم الغاء الطلب بنجاح',
        error: true,
      },
    );
    if (res?.status == 200)
      router.push('/content-management/orders');
  };

  // upload bill
  const UploadBill = async (payload: File | null) => {
    const res: any = await POST<{ billUrl: string }, { id: string; branchId: string; billFile: null | File }>(OrderApi.UploadBill, { id: route.params.id as string, branchId: shopTab.value, billFile: payload }, { success: 'تم توليد الفاتورة' }, { formData: true })
    invoiceDto.value.invoiceUrl = res?.data.billUrl
  }

  // GETS ORDER

  const GetProductsForSelectedShop = async (id: string) => {
    try {
      loader.value = true;

      const { data } = await GET<CategoryWithProducts[]>(
        BranchCategoryApi.GetAll,
        { branchId: id },
      );

      loader.value = false;
      categoriesWithProducts.value = data;
    }
    catch (er) {
      loader.value = false;

      console.log(er);
    }
  };

  // get create order
  const GetConfirmAdd = async () => {
    console.log(customerData);
    loader.value = true;
    console.log('customer data  : ', customerData.value, selectedAddress.value);
    try {
      const result = await GET<OrderShopsItemDTO[]>(OrderApi.GetConfirmAdd, {
        cityId: route.query.cityId
          ? route.query.cityId
          : customerData.value?.cityId,
        addressAreaId: selectedAddress.value,
      });
      loader.value = false;
      orderShopsList.value = result.data;
    }
    catch (er) {
      loader.value = false;
    }
  };

  // get confirme order
  const GetConfirmedOrderById = async (id: string) => {
    loader.value = true;
    const { data } = await GET<GetConfirmedOrderDTO>(
      OrderApi.GetConfirmBranches,
      { id },
    );

    orderCartProducts.value = [];
    fillCart(data.branches)
    selectedShop.value = orderShopsList.value[orderShopsList.value.length - 1];
    confirmOrderDto.value.note = data.note;
    customerData.value = {
      addresses: [],
      cityId: '',
      name: data.customer.name,
      id: data.customer.id,
      orders: [],
      phoneNumber: data.customer.phoneNumber,
      address: data.customer.address,
      orderNumber: data.customer.orderNumber,
    };

    orderInvoice.value = data.invoice;
    confirmOrderDto.value.id = data.id;
    shopTab.value = data.branches[data.branches.length - 1].id;
  };

  // get confirm driver
  const GetConfirmDriver = async () => {
    const { data } = await GET<GetConfirmDriverDTO>(
      OrderApi.GetConfirmDrivers,
      { id: route.params.id },
      { success: 'يرجى اختيار سائق', error: 'فشل تحميل السائقين' },
    );
    driversList.value = data.drivers;

    customerData.value = {
      cityId: data.customer.address,
      id: data.customer.id,
      name: data.customer.name,
      addresses: [],
      orders: [],
      address: data.customer.address as string,
      phoneNumber: data.customer.phoneNumber,
      orderNumber: data.customer.orderNumber,
    };
    selectedAddress.value = data.customer.address
    orderInvoice.value = {
      coast: data.orderDetails.cost,
      deliveryCoast: data.orderDetails.deliveryCost,
      tax: 0,
      discount: 0,
      total: data.orderDetails.totalCost,
      orderCartsCount: data.orderDetails.orderCartsCount,
    };

    expectedReceiveDates.value = data.expectedReceiveDates;
    isPrior.value = data.orderDetails.isPrior

    return data
  };

  // get confirm brach
  const GetConfirmReceiveBranches = async () => {
    const { data } = await GET<OrderDetailDto>(
      OrderApi.GetConfirmReceiveBranches,
      { id: route.params.id },
    );
    console.log(data);
    orderDetailDto.value = data;

    fillCart(data.branches)

    confirmOrderDto.value.note = data.note as string

    if (orderDetailDto.value.invoice)
      orderInvoice.value = orderDetailDto.value.invoice;
    console.log(orderDetailDto.value);
    shopTab.value = data.branches[data.branches.length - 1].id;

    return data;

  };

  // Get Complete Order
  const GetCompleteOrder = async () => {
    const res = await GET<OrderDetailDto>(OrderApi.GetComplete, {
      id: route.params.id,
    });

    orderInvoice.value = res.data.invoice ?? orderInvoice.value

    fillCart(res.data.branches)

    confirmOrderDto.value.note = res.data.note as string
    orderDetailDto.value = res.data;

    return res.data;

  };

  // Get UnComplete Order
  const GetUnCompleteOrder = async () => {
    const res = await GET<OrderDetailDto>(OrderApi.GetInComplete, {
      id: route.params.id,
    });
    orderDetailDto.value = res.data;
    fillCart(res.data.branches)
    return res.data;

  };

  // Get ConfirmReceive Customer
  const GetConfirmReceiveCustomer = async () => {
    const { data } = await GET<OrderDetailDto>(OrderApi.GetConfirmReceiveCustomer, {
      id: route.params.id,
    });
    orderDetailDto.value = data;

    fillCart(data.branches)

    if (data.invoice)
      orderInvoice.value = data.invoice;

    shopTab.value = data.branches[data.branches.length - 1].id;

    return data;
  };

  // create order
  const ConfirmOrder = async () => {
    loader.value = true;
    console.log(confirmOrderDto.value);

    // delete confirmOrderDto.value.id;
    try {
      const res = await POST<{ stage: string; id: string }, ConfirmAddDTO>(
        OrderApi.ConfirmAdd,
        {
          ...confirmOrderDto.value,
          branches: branchesDtoList.value,
          customerId: customerData.value.id,
          addressId: selectedAddress.value,
        },
        {
          comfirm: false,
          error: true,
          success: 'تم حفظ الطلب .. يرجى اعلام المتاجر',
        },
      );

      loader.value = false;
      if (res?.data) {
        confrimBranshDto.value.id = res.data.id;
        confirmOrderDto.value.id = res.data.id;

      }

      customerData.value.address = addresses.value.find(a => a.id === selectedAddress.value)?.text

      // selectedAddress.value = addresses.value.find(a => a.id === selectedAddress.value)?.text as string

      router.replace({
        name: route.name as string,
        params: { id: res?.data.id },
        query: {
          stage: Order_Stage.Confirmed,
          isConfirmedOrder: 1,
          tellBranches: 0,
          isConfirmedDriver: 0,
          receivedFromBranches: 0,
          receivedToCustomer: 0,
          rollBack: 0,
        },
        force: true,
      });

      GetConfirmedOrderById(res?.data.id as string)

    }
    catch (er) {
      console.log(er);

      loader.value = false;

      // Swal.fire({
      //   icon: 'error',
      //   title: 'حسم على الطلب غير متوفر',
      //   text: `${er.data.message}`,
      // });

    }
  };

  const resetOrderState = () => {
    orderCartProducts.value = [];
    confirmOrderDto.value = new ConfirmAddDTO();
    orderShopsList.value = [];
    categoriesWithProducts.value = [];
    selectedAddress.value = '';
    selectedShop.value = {
      areaId: '',
      name: '',
      id: '',
      address: '',
      hasDeliveryService: false,
      isOnline: false,
    };
  };



  // const search = () => {
  //   orders.value = orders.value.filter((el: any) => {
  //     return el.customerName
  //       .toLowerCase()
  //       .includes(searchOrder.value.toLocaleLowerCase());
  //   });
  // };
  // const filter = () => {
  //   orders.value = AllOrders.value;
  //   if (searchOrder.value !== '')
  //     search();
  // };

  // watch(searchOrder, () => {
  //   filter();
  // });

  const dateFilterd = () => {
    if (startDate.value && endDate.value) {
      const startArray = startDate.value.split('T')[0].split('-');
      const endArray = endDate.value.split('T')[0].split('-');

      orders.value = orders.value.filter((item: any) => {
        const itemArr = item.date.split('T')[0].split('-');

        const startValue
          = parseFloat(startArray[0])
          + parseFloat(startArray[1]) * 0.1
          + parseFloat(startArray[2]) * 0.01;
        const endValue
          = parseFloat(endArray[0])
          + parseFloat(endArray[1]) * 0.1
          + parseFloat(endArray[2]) * 0.01;
        const itemValue
          = parseFloat(itemArr[0])
          + parseFloat(itemArr[1]) * 0.1
          + parseFloat(itemArr[2]) * 0.01;

        return startValue <= itemValue && endValue >= itemValue;
      });
    }
  };

  const filterFunciton = () => {
    orders.value = AllOrders.value;
    if (startDate.value !== '' && endDate.value !== '')
      dateFilterd();
  };

  const deleteItemFromCart = (id: string) => {

    if (route.query.stage === Order_Stage.Confirmed) {
      DELETE(OrderCartApi.Delete, {
        orderId: route.params.id as string,
        productId: id,
      }).then(() => {
        orderCartProducts.value = orderCartProducts.value.filter(p => p.id !== id)

      })
    }
    else {

      orderCartProducts.value = orderCartProducts.value.filter(p => p.id !== id)
    }
  }

  watch(startDate, () => {
    if (startDate.value !== null) {
      if (startDate.value !== '' && endDate.value !== '')
        filterFunciton();
    }

  });

  watch(endDate, () => {
    if (endDate.value !== null) {
      if (startDate.value !== '' && endDate.value !== '')
        filterFunciton();
    }

  });

  return {
    searchOrder,
    orderDetailDto,
    GetAllOrder,
    invoiceDto,
    startDate,
    endDate,
    GetConfirmReceiveCustomer,
    orderStatus,
    GetCompleteOrder,
    orderType,
    isRollBack,
    CalcInvoice,
    GetConfirmAdd,
    DeleteOrder,
    UploadBill,
    isDialogUnconifermOrder,
    handleOrderDto,
    HandlerOrder,
    GetProductsForSelectedShop,
    AddProductToCart,
    ConfirmBranch,
    removeCartItem,
    ConfirmReceiveCustomer,
    RoleBackOrder,
    CancelOrder,
    setCartItemQuantity,
    ConfirmOrder,
    GetConfirmedOrderById,
    GetConfirmDriver,
    GetConfirmReceiveBranches,
    resetOrderState,
    ConfirmDtiver,
    selectedDriver,
    isPrior,
    GetUnCompleteOrder,
    ConfirmReceiveBranch,
    expectedReceiveDates,
    driversList,
    branchesDtoList,
    confrimBranshDto,
    isConfirmedOrder,
    orders,
    selectedAddress,
    filterDto,
    pagination,
    orderStatusOptions,
    orderFilterParams,
    customerData,
    addresses,
    orderShopsList,
    selectedShop,
    currentOrderAreaID,
    selectedShops,
    canFinishOrder,
    categoriesWithProducts,
    confirmOrderDto,
    orderCartProducts,
    orderInvoice,
    loader,
    shopTab,
    fiterOrder,
    deleteItemFromCart,
    offers,
    orderId,
  };
});
