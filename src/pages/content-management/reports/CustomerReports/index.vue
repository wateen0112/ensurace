<script setup lang="ts">
import { useApi } from "@/composables";
import Page from "@/components/shared/Page.vue";
import { useAppStore } from "@/stores/App";
import { useReports } from "@/stores/Reports";
import { useRouter } from "vue-router";
import { ReportsApi } from "@/api/Reports/endpoints";

const { GET } = useApi();
const Store = useReports();
const { startDate, endDate, query, filterVal, pagination } = storeToRefs(Store);
const router = useRouter();
const paginationList = computed(() => Store.CustomerList);
const expotToExcel = async () => {
  const res = await GET(
    ReportsApi.GetExportCustomers,
    {
      Search: query.value,
      StartDate: startDate.value,
      EndDate: endDate.value,
      OrderBy: filterVal.value,
      PageSize: pagination.value.pageSize,
      PageIndex: pagination.value.pageIndex,
    },
    null,
    { responseType: "blob" }
  );
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "CustomerReport.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// function changeVal() {
//   Store.GetAllCustomer();
// }

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "uil:analytics",
    title: "تقارير وإحصائيات الزبائن",
  });
  Store.GetAllCustomer();
};

const statusList = [
  {
    key: "TotalCoast ,OrdersCount",
    title: "كل الطلبات",
  },
  {
    key: "OrdersCount",
    title: "عدد الطلبات",
  },
  {
    key: "TotalCoast",
    title: "قيمة الطلبات",
  },
];

const headers = [
  "اسم الزبون",
  "رقم الموبايل",
  "المحافظة",
  "المواليد",
  "العنوان",
  "عدد الطلبات",
  "السعر الكلي",
  "تاريخ آخر طلب",
  "حالة آخر طلب",
  "تفاصيل",
];
function goToDetails(id: string) {
  router.push(`/content-management/customers/${id}`);
}

const print = () => {
  window.print();
};

// onMounted(() => {
//   Store.GetAllCustomer();
// });

onLoad();
</script>

<template>
  <Page :has-search="false" :add="false">
    <template #action-button>
      <div class="flex justify-center items-center gap-3 btnExport">
        <VBtn color="primary" @click="print"> طباعة </VBtn>
        <VBtn color="primary" variant="outlined" @click="expotToExcel">
          تصدير
        </VBtn>
      </div>
    </template>
    <div>
      <div class="searchCus">
        <VRow class="flex">
          <VCol cols="2" md="4"> الزبائن الأكثر نشاطاً </VCol>
          <VCol cols="2" md="2">
            <VSelect
              v-model="filterVal"
              label="ترتيب حسب: عدد الطلبات"
              :value="filterVal"
              item-value="key"
              item-title="title"
              :items="statusList"
              @update:model-value="Store.GetAllCustomer()"
            />
          </VCol>
          <VCol cols="2" md="2">
            <div class="col-span-4">
              <div class="flex justify-center items-center">
                <VTextField
                  v-model="query"
                  append-inner-icon="mdi-search"
                  label="ابحث عن زبون معين"
                  @input="Store.GetAllCustomer()"
                />
              </div>
            </div>
          </VCol>
          <VCol cols="3" md="2">
            <div class="min-w-[120px]">
              <div class="flex justify-center items-center">
                <label class="mx-5">من</label>
                <AppDateTimePicker v-model="startDate" />
              </div>
            </div>
          </VCol>
          <VCol cols="3" md="2">
            <div class="min-w-[120px]">
              <div class="flex justify-center items-center">
                <label class="mx-5">إلى</label>
                <AppDateTimePicker v-model="endDate" />
              </div>
            </div>
          </VCol>
        </VRow>
      </div>
      <!-- {{ paginationList }} -->
      <!-- v-if="paginationList.length" -->
      <div>
        <div class="my-9">
          <VTable class="text-no-wrap">
            <thead class="text-center">
              <tr class="text-center items-center">
                <th scope="col">اسم الزبون</th>
                <th scope="col">رقم الموبايل</th>
                <th scope="col">المحافظة</th>
                <th scope="col" class="printCus">المواليد</th>
                <th scope="col" class="printCus">العنوان</th>
                <th scope="col">عدد الطلبات</th>
                <th scope="col">السعر الكلي</th>
                <th scope="col">تاريخ اخر طلب</th>
                <th scope="col">حالة اخر طلب</th>
                <th scope="col" class="printCus">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginationList" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.phoneNumber }}</td>
                <td>{{ item.city }}</td>
                <td class="printCus">
                  {{ new Date(item.birthDate).toLocaleDateString() }}
                </td>
                <td class="printCus">{{ item.address }}</td>
                <td>{{ item.orderCount }}</td>
                <td>{{ item.totalCoast }}</td>
                <td>
                  {{
                    item.lastOrderDate
                      ? new Date(item.lastOrderDate).toLocaleDateString()
                      : "______"
                  }}
                </td>
                <td>
                  <VChip
                    v-if="item.lastOrderStatus === 'InProcess'"
                    variant="tonal"
                    color="info"
                  >
                    قيد الانتظار
                  </VChip>
                  <VChip
                    v-else-if="item.lastOrderStatus === 'UnConfirmed'"
                    variant="tonal"
                    color="secondary"
                  >
                    غير مؤكد
                  </VChip>
                  <VChip
                    v-else-if="item.lastOrderStatus === 'Confirmed'"
                    variant="tonal"
                    color="primary"
                  >
                    مؤكد
                  </VChip>
                  <VChip
                    v-else-if="item.lastOrderStatus === 'NewOrder'"
                    variant="tonal"
                    color="primary"
                  >
                    طلب جديد
                  </VChip>
                  <VChip
                    v-else-if="item.lastOrderStatus === 'OnWay'"
                    variant="tonal"
                    color="warning"
                  >
                    في الطريق
                  </VChip>
                  <VChip
                    v-else-if="item.lastOrderStatus === 'Done'"
                    variant="tonal"
                    color="success"
                  >
                    تم التسليم
                  </VChip>
                  <VChip
                    v-else-if="item.lastOrderStatus === 'error'"
                    variant="tonal"
                    color="primary"
                  >
                    ملغي
                  </VChip>
                  <VChip
                    v-else-if="item.lastOrderStatus === 'RollBack'"
                    variant="tonal"
                    color="primary"
                  >
                    مرتجع
                  </VChip>
                </td>
                <td class="text-center printCus">
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
      class="d-flex align-center flex-wrap justify-center gap-4 py-3 paginationCus"
    >
      <span class="text-sm text-disabled" />
      <VPagination
        v-model="pagination.pageIndex"
        rounded="circle"
        class="pb-5 pt-3"
        :length="pagination.totalPages"
        @update:model-value="Store.GetAllCustomer()"
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
  .searchCus {
    display: none !important;
  }
  .paginationCus {
    display: none !important;
  }
  .printCus {
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
