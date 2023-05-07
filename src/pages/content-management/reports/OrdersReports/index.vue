<script setup lang="ts">
import { useApi } from "@/composables";
import Page from "@/components/shared/Page.vue";
import AutoComplete from "@/components/customers/CustomerAutoComplete.vue";
import { useAppStore } from "@/stores/App";
import { useReports } from "@/stores/Reports";
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import { ReportsApi } from "@/api/Reports/endpoints";

const { GET } = useApi();
const Store = useReports();
const router = useRouter();
const { fiterOrder, AllOrdersList, OredrDto, pagination } = storeToRefs(Store);
const { end, start, fiter, fiterDriver, fiterBranch } = storeToRefs(Store);
const { paginate } = usePagination();
const paginationList = computed(() => Store.AllOrdersList);
const exportToExcel = async () => {
  const res = await GET(
    ReportsApi.GetExportOrders,
    {
      Search: fiter.value,
      StartDate: start.value,
      EndDate: end.value,
      OrderBy: fiterOrder.value,
      PageSize: pagination.value.pageSize,
      PageIndex: pagination.value.pageIndex,
    },
    null,
    { responseType: "blob" }
  );
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "OrdersReport.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
function changeVal() {
  Store.GetAllOrders();
}
const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "uil:analytics",
    title: "  تقارير وإحصائيات الطلبات",
  });
};

onLoad();
const statusOrder = [
  {
    key: "InProcess",
    title: "قيد الانتظار",
  },
  {
    key: "UnConfirmed",
    title: "غير مؤكد",
  },
  {
    key: "Confirmed",
    title: " مؤكد",
  },
  {
    key: "NewOrder",
    title: "طلب جديد ",
  },
  {
    key: "OnWay",
    title: " في الطريق",
  },
  {
    key: "Done",
    title: " تم التسليم",
  },
  {
    key: "Cansel",
    title: " ملغي",
  },
  {
    key: "RollBack",
    title: " مرتجع",
  },
];

const print = () => {
  window.print();
};

function goToDetails(id: string) {
  router.push(`/content-management/orders/stage/ConfirmOrder/${id}`);
}
Store.GetAllOrders();
// onMounted(() => {
//   Store.GetAllOrders();
// });
</script>

<template>
  <Page :add="false" :has-search="false">
    <template #action-button>
      <div class="flex justify-center items-center gap-3 btnExport">
        <VBtn color="primary" @click="print"> طباعة </VBtn>
        <VBtn color="primary" variant="outlined" @click="exportToExcel">
          تصدير
        </VBtn>
      </div>
    </template>
    <div>
      <div class="searchOrder">
        <VRow class="flex">
          <VCol cols="2" md="2">
            <VSelect
              v-model="fiterOrder"
              label="فلترة :  حالة الطلب"
              :value="fiterOrder"
              :items="statusOrder"
              item-value="key"
              item-title="title"
              @update:model-value="changeVal"
            />
          </VCol>
          <VCol cols="2" md="2">
            <div class="col-span-4">
              <div class="flex justify-center items-center">
                <VTextField
                  v-model="fiter"
                  append-inner-icon="mdi-search"
                  label="ابحث عن زبون معين"
                  @update:model-value="changeVal"
                />
              </div>
            </div>
          </VCol>
          <VCol cols="3" md="4" class="flex gap-3">
            <div class="min-w-[120px]">
              <div class="flex justify-center items-center">
                <label class="ml-1">من</label>
                <AppDateTimePicker v-model="start" />
              </div>
            </div>

            <div class="min-w-[120px]">
              <div class="flex justify-center items-center">
                <label class="ml-1">إلى</label>
                <AppDateTimePicker v-model="end" />
              </div>
            </div>
          </VCol>
        </VRow>
      </div>
      <div>
        <div class="my-9">
          <VTable class="text-no-wrap">
            <thead class="text-center">
              <tr class="text-center items-center">
                <th scope="col">رقم الطلب</th>
                <th scope="col">اسم الزبون</th>
                <th scope="col">رقم الموبايل</th>
                <th scope="col" class="printOrder">العنوان</th>
                <th scope="col">اسم المتجر</th>
                <th scope="col">تاريخ الطلب</th>
                <th scope="col">اسم السائق</th>
                <th scope="col">نوع الطلب</th>
                <th scope="col">حالة الطلب</th>
                <th scope="col" class="printOrder">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginationList" :key="item.id">
                <td>{{ item.number }}</td>
                <td>{{ item.customerName }}</td>
                <td>{{ item.phoneNumber }}</td>
                <td class="printOrder">{{ item.address }}</td>
                <td>{{ item.branchNames.join("_") }}</td>
                <td>{{ new Date(item.date).toLocaleDateString() }}</td>
                <td>{{ item.driverName ? item.driverName : "______" }}</td>
                <td>{{ item.orderType }}</td>
                <td>
                  <VChip
                    v-if="item.status === 'InProcess'"
                    variant="tonal"
                    color="info"
                  >
                    قيد الانتظار
                  </VChip>
                  <VChip
                    v-else-if="item.status === 'UnConfirmed'"
                    variant="tonal"
                    color="secondary"
                  >
                    غير مؤكد
                  </VChip>
                  <VChip
                    v-else-if="item.status === 'Confirmed'"
                    variant="tonal"
                    color="primary"
                  >
                    مؤكد
                  </VChip>
                  <VChip
                    v-else-if="item.status === 'NewOrder'"
                    variant="tonal"
                    color="primary"
                  >
                    طلب جديد
                  </VChip>
                  <VChip
                    v-else-if="item.status === 'OnWay'"
                    variant="tonal"
                    color="warning"
                  >
                    في الطريق
                  </VChip>
                  <VChip
                    v-else-if="item.status === 'Done'"
                    variant="tonal"
                    color="success"
                  >
                    تم التسليم
                  </VChip>
                  <VChip
                    v-else-if="item.status === 'error'"
                    variant="tonal"
                    color="primary"
                  >
                    ملغي
                  </VChip>
                  <VChip
                    v-else-if="item.status === 'RollBack'"
                    variant="tonal"
                    color="primary"
                  >
                    مرتجع
                  </VChip>
                </td>
                <td class="text-center printOrder">
                  <VBtn
                    icon="mdi-dots-vertical"
                    size="x-small"
                    scope="col"
                    class="text-center"
                    @click="goToDetails(item.id)"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>
        </div>
      </div>
    </div>
    <div
      class="d-flex align-center flex-wrap justify-center gap-4 py-3 paginationOrder"
    >
      <span class="text-sm text-disabled" />
      <VPagination
        v-model="pagination.pageIndex"
        class="pb-5 pt-3"
        rounded="circle"
        :length="pagination.totalPages"
        @update:model-value="Store.GetAllOrders()"
      />
    </div>
  </Page>
</template>

<style>
@media print {
  .layout-vertical-nav {
    display: none !important;
  }
  .layout-navbar {
    display: none !important;
  }
  .layout-content-wrapper {
    padding: 0px !important;
  }
  .layout-footer {
    display: none !important;
  }
  /* .page-header {
    display: none !important;
  } */
  .searchOrder {
    display: none !important;
  }
  .paginationOrder {
    display: none !important;
  }
  .printOrder {
    display: none !important;
  }
  .btnExport {
    display: none !important;
  }
}
</style>

<route lang="yaml">
meta:
  roles: ["SuperAdmin", "Accountant"]
</route>
