import type { OrdersChart, CustomerDto, AllCustomer } from "@/api/Reports/dto";
import type { OrderDto, AllOrders } from "@/api/Reports/Orders/dto";

import { ReportsApi } from "@/api/Reports/endpoints";
import { useApi, usePagination } from "@/composables/index";
import { defineStore } from "pinia";
import { AllOrdersDTO } from "@/api/Reports/Orders/dto";
import {
  GetAllCustomerFilters,
  ChartDto,
  CustomerFilter,
} from "@/api/Reports/dto";

export const useReports = defineStore("Reports", () => {
  const { GET } = useApi();
  const { pagination } = usePagination();
  const OrderList = ref<OrdersChart[]>([]);
  const CustomerList = ref<AllCustomer[]>([]);
  const tempList = ref<AllCustomer[]>([]);
  const AllOrdersList = ref<AllOrders[]>([]);
  const Orderes = ref<AllOrders[]>([]);
  const Customer = ref<AllCustomer[]>([]);
  const filterDto = ref<GetAllCustomerFilters>(new GetAllCustomerFilters());
  const OredrDto = ref<AllOrdersDTO>(new AllOrdersDTO());
  const Dto = ref<CustomerFilter>(new CustomerFilter());
  const CharDto = ref<ChartDto>(new ChartDto());
  const yearVal = ref("2023");
  const filterVal = ref("");
  const startDate = ref("");
  const endDate = ref("");
  const query = ref("");
  const start = ref("");
  const end = ref("");
  const fiterOrder = ref("");
  const fiter = ref("");
  const fiterDriver = ref("");
  const fiterBranch = ref("");

  const status = ref("");
  async function GetAllOrdersChart(year: any) {
    try {
      const response = await GET<ChartDto[]>(ReportsApi.GetOrdersChart + year, {
        ...CharDto,
      });

      OrderList.value = response.data;
      CharDto.value = response.data;

      return response;
    } catch (er) {
      console.log("ERROR", er);
    }
  }

  // Customer --------------------------

  async function GetAllCustomer() {
    try {
      const response = await GET<CustomerDto>(ReportsApi.GetCustomer, {
        ...pagination.value,
        ...filterDto,
        ...Dto,
        OrderBy: filterVal.value,
        Search: query.value,
      });

      tempList.value = response.data.customers;
      CustomerList.value = response.data.customers;
      pagination.value.totalCount = response.data.count;

      console.log("ERROR", response.data.count);

      return response;
    } catch (er) {
      console.log(er);
      
    }
  }

  const filterListCustomer = computed(() => {
    return CustomerList.value.filter(
      (ele: { name: string; orderCount: number; phoneNumber: string }) =>
        ele.name.toLowerCase().includes(filterVal.value.toLowerCase()) ||
        ele.orderCount
          .toString()
          .toLowerCase()
          .includes(filterVal.value.toLowerCase()) ||
        ele.phoneNumber.toLowerCase().includes(filterVal.value.toLowerCase()) ||
        !CustomerList.value
    );
  });

  const paginateListCustomer = computed(() => {
    return filterListCustomer.value.slice(
      (pagination.value.pageIndex - 1) * pagination.value.pageSize,
      pagination.value.pageSize * pagination.value.pageIndex
    );
  });

  // Orders --------------------------

  async function GetAllOrders() {
    try {
      const response = await GET<OrderDto>(ReportsApi.GetOrder, {
        ...filterDto,
        ...pagination.value,
        ...OredrDto,
        OrderStatus:fiterOrder.value,
        Search: fiter.value,
      });

      AllOrdersList.value = response.data.orders;
      Orderes.value = response.data.orders;
      pagination.value.totalCount = response.data.count;

      return response;
    } catch (er) {
      console.log("ERROR", er);
    }
  }

  // ----------------------------------

  const dateFilterd = () => {
    if (startDate.value && endDate.value) {
      const startArray = startDate.value.split("T")[0].split("-");
      const endArray = endDate.value.split("T")[0].split("-");

      CustomerList.value = CustomerList.value.filter((item: any) => {
        const itemArr = item.lastOrderDate.split("T")[0].split("-");

        const startValue =
          parseFloat(startArray[0]) +
          parseFloat(startArray[1]) * 0.1 +
          parseFloat(startArray[2]) * 0.01;
        const endValue =
          parseFloat(endArray[0]) +
          parseFloat(endArray[1]) * 0.1 +
          parseFloat(endArray[2]) * 0.01;
        const itemValue =
          parseFloat(itemArr[0]) +
          parseFloat(itemArr[1]) * 0.1 +
          parseFloat(itemArr[2]) * 0.01;

        return startValue <= itemValue && endValue >= itemValue;
      });
    }
  };
  // const search = () => {
  //   CustomerList.value = CustomerList.value.filter((item: any) => {
  //     return item.name.toLowerCase().includes(query.value.toLowerCase());
  //   });
  // };

  const filterFunciton = () => {
    CustomerList.value = tempList.value;
    if (startDate.value !== "" && endDate.value !== "") dateFilterd();
  };

  watch(startDate, () => {
    if (startDate.value !== null) {
      if (startDate.value !== "" && endDate.value !== "") filterFunciton();
    }
  });

  watch(endDate, () => {
    if (endDate.value !== null) {
      if (startDate.value !== "" && endDate.value !== "") filterFunciton();
    }
  });

  // FilterOrder-------------------------------------------
  const date = () => {
    if (start.value && end.value) {
      const startArray = start.value.split("T")[0].split("-");
      const endArray = end.value.split("T")[0].split("-");

      AllOrdersList.value = AllOrdersList.value.filter((item: any) => {
        const itemArr = item.date.split("T")[0].split("-");

        const startValue =
          parseFloat(startArray[0]) +
          parseFloat(startArray[1]) * 0.1 +
          parseFloat(startArray[2]) * 0.01;
        const endValue =
          parseFloat(endArray[0]) +
          parseFloat(endArray[1]) * 0.1 +
          parseFloat(endArray[2]) * 0.01;
        const itemValue =
          parseFloat(itemArr[0]) +
          parseFloat(itemArr[1]) * 0.1 +
          parseFloat(itemArr[2]) * 0.01;

        return startValue <= itemValue && endValue >= itemValue;
      });
    }
  };

  const searchDriver = () => {
    AllOrdersList.value = AllOrdersList.value.filter((item: any) => {
      return item.branchNames.includes(fiterDriver.value);
    });
  };
  const searchBranch = () => {
    AllOrdersList.value = AllOrdersList.value.filter((item: any) => {
      return item.branchNames.includes(fiterBranch.value);
    });
  };

  const Funciton = () => {
    AllOrdersList.value = Orderes.value;
    if (start.value !== "" && end.value !== "") date();
  };

  const FuncitonDriver = () => {
    AllOrdersList.value = Orderes.value;
    if (fiterDriver.value !== "") searchDriver();
  };

  const FuncitonBranch = () => {
    AllOrdersList.value = Orderes.value;
    if (fiterBranch.value !== "") searchBranch();
  };

  watch(start, () => {
    if (start.value !== null) {
      if (start.value !== "" && end.value !== "") Funciton();
    }
  });

  watch(end, () => {
    if (end.value !== null) {
      if (start.value !== "" && end.value !== "") Funciton();
    }
  });

  watch(fiter, () => {
    Funciton();
  });
  watch(fiterDriver, () => {
    FuncitonDriver();
    console.log(FuncitonDriver());
  });
  watch(fiterBranch, () => {
    FuncitonBranch();
    console.log(FuncitonBranch());
  });

  return {
    Dto,
    tempList,
    CharDto,
    fiterOrder,
    fiterDriver,
    fiterBranch,
    OredrDto,
    AllOrdersList,
    GetAllCustomer,
    CustomerList,
    GetAllOrdersChart,
    OrderList,
    yearVal,
    fiter,
    GetAllOrders,
    endDate,
    startDate,
    filterDto,
    query,
    filterVal,
    status,
    end,
    start,
    paginateListCustomer,
    pagination,
  };
});
