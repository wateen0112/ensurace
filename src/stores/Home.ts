import type {
  HomeStatic,
  ContactUs,
  OrderChart,
  MostOrdered,
  customers,
  branches,
  products,
} from "@/api/Home/dto";
import {
  HomeStaticDto,
  ContactUsDTO,
  OrderChartDTO,
  CustomersDto,
  BranchesDto,
  ProductsDto,
} from "@/api/Home/dto";
import { HomeApi } from "@/api/Home/endpoints";
import { useApi } from "@/composables/index";
import { defineStore } from "pinia";

export const useHomeStore = defineStore("Home", () => {
  const { GET } = useApi();
  const Home = ref<HomeStatic[]>([]);
  const HomeDto = ref<HomeStaticDto>(new HomeStaticDto());
  const AllContact = ref<ContactUs[]>([]);
  const ContDto = ref<ContactUsDTO>(new ContactUsDTO());
  const AllOrderChart = ref<OrderChart[]>([]);
  const AllCustomerOrdered = ref<customers[]>([]);
  const AllBranchesOrdered = ref<branches[]>([]);
  const AllProductOrdered = ref<products[]>([]);
  const MostOrderedList = ref<MostOrdered[]>([]);
  const tempList = ref<MostOrdered[]>([]);
  const OrderDTO = ref<OrderChartDTO>(new OrderChartDTO());
  const CustomerDTO = ref<CustomersDto>(new CustomersDto());
  const ProductDTO = ref<ProductsDto>(new ProductsDto());
  const BranchDTO = ref<BranchesDto>(new BranchesDto());
  const Year = ref(2023);
  const startDate = ref('2022-01-01');
  const endDate = ref("2023-01-26");

  async function HomStatic() {
    try {
      const response = await GET<HomeStatic[]>(HomeApi.GetStatistic, {
        ...HomeDto,
      });

      Home.value = response.data;
    } catch (er) {}
  }
  async function Contact(filter: any) {
    try {
      const response = await GET<ContactUs[]>(HomeApi.GetContactUs + filter, {
        ...ContDto,
      });

      AllContact.value = response.data;
      ContDto.value = response.data;
    } catch (er) {
      console.log("ERROR", er);
    }
  }
  async function OrderChart(year: any) {
    try {
      const response = await GET<OrderChart[]>(HomeApi.GetOrder + year, {
        ...OrderDTO,
      });

      AllOrderChart.value = response.data;
      OrderDTO.value = response.data;
    }
     catch (er) {
      console.log("ERROR", er);
    }
  }

  const Ordered = async () => {
    try {
      const response = await GET<MostOrdered[]>(
        HomeApi.MostOrder,
        {
          startDate: startDate.value,
          endDate: endDate.value,
        },
        { error: false }
      );
      MostOrderedList.value = response.data;
      tempList.value = response.data;
      AllCustomerOrdered.value = response.data.customers;
      AllProductOrdered.value = response.data.products;
      AllBranchesOrdered.value = response.data.branches;
    } catch (er) {}
  };
    watch(startDate, () => {
      if (startDate.value !== "" && endDate.value !== "") Ordered();
    });

    watch(endDate, () => {
      if (startDate.value !== "" && endDate.value !== "") Ordered();
    });

  return {
    HomStatic,
    Home,
    HomeDto,
    AllContact,
    ContDto,
    Contact,
    Year,
    OrderChart,
    OrderDTO,
    AllOrderChart,
    startDate,
    endDate,
    AllCustomerOrdered,
    AllProductOrdered,
    AllBranchesOrdered,
    Ordered,
    MostOrderedList,
  };
});
