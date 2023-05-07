<script setup lang="ts">
import Page from "@/components/shared/Page.vue";
import AutoComplete from "@/components/customers/CustomerAutoComplete.vue";
import { useAppStore } from "@/stores/App";
import { useReportsStore } from "@/stores/ReportsShops";
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import { ReportsApi } from "@/api/Reports/endpoints";
import { useApi } from "@/composables";

const { GET } = useApi();
const Store = useReportsStore();
const router = useRouter();
const { shopsList, startDate, searchShops, endDate, pagination, filters } =
  storeToRefs(Store);
Store.GetBranchesReports();

const paginationList = computed(() => Store.shopsList);
const exportToExcel = async () => {
  const res = await GET(
    ReportsApi.GetExportShops,
    {
      Search: searchShops.value,
      StartDate: startDate.value,
      EndDate: endDate.value,
      OrderBy: filters.value,
      PageSize: pagination.value.pageSize,
      PageIndex: pagination.value.pageIndex,
    },
    null,
    { responseType: "blob" }
  );
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "StoresReport.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
const headers = [
  "اسم المتجر ",
  "رقم الموبايل",
  "العنوان",
  "عدد الطلبات  ",
  "مجموع الطلبات",
  "تاريخ الإضافة",
  "أكثر زبون شراءاً  ",
  "أكثر 4 وجبات طلباً  ",
  "تفاصيل ",
];

const print = () => {
  window.print();
};

const statusList = [
  {
    key: "TotalCoast ,OrdersCount",
    title: "كل الطلبات ",
  },
  {
    key: "OrdersCount",
    title: "ترتيب حسب: عدد الطلبات",
  },
  {
    key: "TotalCoast",
    title: " قيمة الطلبات",
  },
];
// function changeVal() {
//   Store.GetAllBranches();
// }

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "uil:analytics",
    title: " تقارير وإحصائيات المتاجر",
  });
  Store.GetBranchesReports();
};

function goToDetails(id: string) {
  router.push(`/content-management/shops/${id}`);
}

onLoad();
</script>

<template>
  <!-- <div>{{ shopsList }}</div> -->
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
      <div class="searchShop">
        <VRow class="flex">
          <VCol cols="2" md="4"> المتاجر الأكثر مبيعاً </VCol>
          <VCol cols="2" md="2">
            <VSelect
              v-model="filters"
              label="ترتيب حسب: عدد الطلبات"
              :value="filters"
              item-value="key"
              item-title="title"
              :items="statusList"
              @change="Store.GetBranchesReports()"
            />
          </VCol>
          <VCol cols="2" md="2">
            <div class="col-span-4">
              <div class="flex justify-center items-center">
                <VTextField
                  v-model="searchShops"
                  append-inner-icon="mdi-search"
                  label="ابحث عن زبون معين"
                  @input="Store.GetBranchesReports()"
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

      <div>
        <div class="my-5">
          <VTable class="text-no-wrap">
            <thead class="text-center">
              <tr class="text-center items-center">
                <th scope="col">اسم المتجر</th>
                <th scope="col">رقم الموبايل</th>
                <th scope="col">العنوان</th>
                <th scope="col">عدد الطلبات</th>
                <th scope="col">مجموع الطلبات</th>
                <th scope="col">تاريخ الإضافة</th>
                <th scope="col">أكثر زبون شراءاً</th>
                <th scope="col">أكثر 4 وجبات طلباً</th>
                <th scope="col" class="printShop">التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in paginationList" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.phoneNumber }}</td>
                <td>{{ item.address }}</td>
                <td>{{ item.orderCount }}</td>
                <td>{{ item.totalCoast }}</td>
                <td>{{ new Date(item.dateCreated).toLocaleDateString() }}</td>
                <td>
                  {{
                    item.mostBuyingCustomer ? item.mostBuyingCustomer : "______"
                  }}
                </td>

                <td>
                  <div
                    v-if="item.mostPopularProducts.length > 0"
                    class="flex justify-center items-center"
                  >
                    <VMenu location="end">
                      <template #activator="{ props }">
                        <div class="m-2 overflow-clip w-12" v-bind="props">
                          {{ item.mostPopularProducts.join("...") }}
                        </div>
                        <VIcon class="ml-4" color="primary" v-bind="props">
                          tabler-eye
                        </VIcon>
                      </template>

                      <VList :items="item.mostPopularProducts" />
                    </VMenu>
                  </div>
                </td>
                <td class="text-center printShop">
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
      class="d-flex align-center flex-wrap justify-center gap-4 py-3 paginationShop"
    >
      <span class="text-sm text-disabled" />
      <VPagination
        v-model="pagination.pageIndex"
        rounded="circle"
        class="pb-5 pt-3"
        :length="pagination.totalPages"
        @update:model-value="Store.GetBranchesReports()"
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
  .searchShop {
    display: none !important;
  }
  .paginationShop {
    display: none !important;
  }
  .printShop {
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
