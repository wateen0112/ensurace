import type {
  GetAllBranchInvoice,
  GetByIdBranchInvoice,
  GetUnPaidBranchInvoice,
  Orders,
} from '@/api/Invoice/Shop/dto';
import type {
  GetAllDriverInvoice,
  GetByIdDriverInvoice,
  GetUnPaidDriverInvoice,
  Order,
} from '@/api/Invoice/Driver/dto';
import { BranchInvoiceApi } from '@/api/Invoice/Shop/endpoints';
import { DriverInvoiceApi } from '@/api/Invoice/Driver/endpoints';
import { useApi } from '@/composables/index';
import { defineStore } from 'pinia';
import {
  AddInvoice as AddInvoiceDto,
  GetDetailsInvoice as DetailsInvoiceDto,
} from './../api/Invoice/Shop/dto';
import {
  AddInvoice as AddInvoiceDriverDto,
  GetDetailsInvoice as DetailsInvoiceDriverDto,
} from './../api/Invoice/Driver/dto';
export const useInvoiceStore = defineStore('Invoice', () => {
  const { GET, POST, DELETE } = useApi();

  // list BranchInvoice
  const BranchInvoiceList = ref<GetAllBranchInvoice[]>([]);
  const DetailsBranshinvoice = ref<GetByIdBranchInvoice[]>([]);
  const unPaidBranchInvoice = ref<Orders[]>([]);
  const numberInvoice = ref<GetUnPaidBranchInvoice>();
  const invoiceDto = ref(new AddInvoiceDto());
  const detailsInvoiceDto = ref(new DetailsInvoiceDto());

  // list DriverInvoice
  const DriverInvoiceList = ref<GetAllDriverInvoice[]>([]);
  const DetailsDriverinvoice = ref<GetByIdDriverInvoice[]>([]);
  const unPaidDriverInvoice = ref<Order[]>([]);
  const numberDriverInvoice = ref<GetUnPaidDriverInvoice>();
  const invoiceDriverDto = ref(new AddInvoiceDriverDto());
  const detailsInvoiceDriverDto = ref(new DetailsInvoiceDriverDto());

  // Branch Invoice
  // Get All Branch
  async function GetAllBranchInvoice() {
    try {
      const response = await GET<GetAllBranchInvoice[]>(
        BranchInvoiceApi.GetAll,
      );

      BranchInvoiceList.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // GetByIdBranch Invoice
  async function GetByIdBranchInvoice(id: any) {
    try {
      const res = await GET<GetByIdBranchInvoice>(BranchInvoiceApi.GetById, {
        id,
      });

      DetailsBranshinvoice.value = res.data;
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  // GetUnPaidOrder Invoice
  async function GetUnPaidBranchInvoice(id: any) {
    try {
      const res = await GET<GetUnPaidBranchInvoice>(
        BranchInvoiceApi.GetUnPaid,
        {
          id,
        },
      );

      numberInvoice.value = res.data.number;
      unPaidBranchInvoice.value = res.data.orders;
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  // Add Invoice
  async function AddInvoice(payload: any) {
    const response = await POST(BranchInvoiceApi.Add, payload, {
      error: true,
      success: 'تمت الاضافة بنجاح',
    });

    console.log(response);
    DetailsBranshinvoice.value?.unshift(payload);
  }

  // GetDetails Invoice
  async function GetDetailsInvoice(id: any) {
    try {
      const res = await GET<GetDetailsInvoice>(BranchInvoiceApi.GetDetails, {
        id,
      });

      detailsInvoiceDto.value = res.data;
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  async function DeleteInvoice(ids: any) {
    try {
      const res = await DELETE(BranchInvoiceApi.Delete, ids);

      DetailsBranshinvoice.value = DetailsBranshinvoice.value.filter(
        ele => !ids.includes(ele.id),
      );
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  // Driver Invoice
  async function GetAllDriverInvoice() {
    try {
      const response = await GET<GetAllDriverInvoice[]>(
        DriverInvoiceApi.GetAll,
      );

      DriverInvoiceList.value = response.data;

      return response;
    }
 catch (er) {
      console.log('ERROR FOLDER', er);
    }
  }

  // GetByIdDriver Invoice
  async function GetByIdDriverInvoice(id: any) {
    try {
      const res = await GET<GetByIdDriverInvoice[]>(DriverInvoiceApi.GetById, {
        id,
      });

      DetailsDriverinvoice.value = res.data;
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  // GetUnPaidOrder Invoice
  async function GetUnPaidDriverInvoice(id: any) {
    try {
      const res = await GET<GetUnPaidDriverInvoice>(
        DriverInvoiceApi.GetUnPaid,
        {
          id,
        },
      );

      numberDriverInvoice.value = res.data.number;
      unPaidDriverInvoice.value = res.data.orders;
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  // Add Invoice
  async function AddInvoiceDriver(payload: any) {
    const response = await POST(DriverInvoiceApi.Add, payload, {
      error: true,
      success: 'تمت الاضافة بنجاح',
    });

    console.log(response);
    DetailsDriverinvoice.value?.unshift(payload);
  }

  // GetDetails Invoice
  async function GetDetailsDriverInvoice(id: any) {
    try {
      const res = await GET<GetDetailsInvoice>(DriverInvoiceApi.GetDetail, {
        id,
      });

      detailsInvoiceDriverDto.value = res.data;
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  async function DeleteDriverInvoice(ids: any) {
    try {
      const res = await DELETE(DriverInvoiceApi.Delete, ids);

      DetailsDriverinvoice.value = DetailsDriverinvoice.value.filter(
        ele => !ids.includes(ele.id),
      );
    }
 catch (e: any) {
      console.log(e.response);
    }
  }

  return {
    GetAllBranchInvoice,
    BranchInvoiceList,
    GetByIdBranchInvoice,
    DetailsBranshinvoice,
    GetUnPaidBranchInvoice,
    unPaidBranchInvoice,
    numberInvoice,
    invoiceDto,
    AddInvoice,
    GetDetailsInvoice,
    detailsInvoiceDto,
    DeleteInvoice,

    GetAllDriverInvoice,
    DriverInvoiceList,
    GetByIdDriverInvoice,
    DetailsDriverinvoice,
    GetUnPaidDriverInvoice,
    numberDriverInvoice,
    unPaidDriverInvoice,
    AddInvoiceDriver,
    GetDetailsDriverInvoice,
    invoiceDriverDto,
    detailsInvoiceDriverDto,
    DeleteDriverInvoice,
  };
});
