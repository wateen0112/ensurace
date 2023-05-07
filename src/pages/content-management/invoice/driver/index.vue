<script lang="ts" setup>
import { useAppStore } from '@/stores/App';
import Page from '@/components/shared/Page.vue';
import { useInvoiceStore } from '@/stores/Invoice';
import { useRouter } from 'vue-router';
import { usePagination } from '@/composables/usePagination';

const { DriverInvoiceList } = storeToRefs(useInvoiceStore());
const { pagination, paginate } = usePagination();
const router = useRouter();
const store = useInvoiceStore();

store.GetAllDriverInvoice();

const paginationList = computed(() => paginate(DriverInvoiceList.value));
function goToDetails(id: string) {
  router.push(`/content-management/invoice/driver/${id}`);
}

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'mdi-currency-usd',
    title: 'كشف حساب السائقين',
  });
};

onLoad();
</script>

<template>
  <Page :add="false" :has-search="false">
    <div v-if="store.DriverInvoiceList.length > 0">
      <VTable class="text-no-wrap invoice-list-table">
        <!-- 👉 Table head -->
        <thead>
          <tr>
            <th scope="col">اسم السائق</th>
            <th scope="col">تاريخ اخر مطابقة</th>
            <th scope="col">عدد التوصيلات</th>
            <th scope="col">نسبة السائق</th>
            <th scope="col">ارباح السائق </th>
            <th scope="col">تفاصيل</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginationList" :key="item.id">
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ new Date(item.lastInvoiceDate).toLocaleDateString() }}
            </td>
            <td>
              {{ item.orderCount }}
            </td>
            <td>
              {{ item.driverPayment }}
            </td>
            <td>
              {{ item.outComing }}
            </td>
            <td>
              <VBtn icon size="lg" variant="text" @click="goToDetails(item.id)">
                <VIcon>mdi-dots-vertical</VIcon>
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 Table Body -->
      </VTable>
    </div>
    <div v-else class="flex justify-center p-4">
      <h3>لا يوجد بيانات</h3>
    </div>
    <!-- SECTION Pagination -->
    <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
      <span class="text-sm text-disabled" />
      <VPagination
        rounded="circle"
        class="pb-5 pt-3"
        v-model="pagination.pageIndex"
        :length="pagination.totalPages"
      />
    </div>
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'Accountant']
  </route>
