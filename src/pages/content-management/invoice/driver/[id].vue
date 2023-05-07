<script lang="ts" setup>
import { useAppStore } from '@/stores/App';
import { useInvoiceStore } from '@/stores/Invoice';
import Page from '@/components/shared/Page.vue';
import { useRouter, useRoute } from 'vue-router';
import { usePagination } from '@/composables/usePagination';

const props = defineProps({
  id: String,
});

const { DetailsDriverinvoice } = storeToRefs(useInvoiceStore());
const { pagination, paginate } = usePagination();
const paginationList = computed(() => paginate(DetailsDriverinvoice.value));
const router = useRouter();
const route = useRoute();

const store = useInvoiceStore();

store.GetByIdDriverInvoice(props.id);

function goToAddInvoice() {
  router.push(`/content-management/invoice/driver/invoice/${route.params.id}`);
  store.GetUnPaidDriverInvoice(route.params.id);
}

function goToDetails(id: string) {
  router.push(`/content-management/invoice/driver/invoice/pages/${id}`);
  store.GetDetailsDriverInvoice(id);
}

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'mdi-currency-usd',
    title: 'الفواتير',
  });
};

onLoad();
</script>

<template>
  <Page
    dialog-title="إضافة فاتورة جديدة"
    placeholder="ابحث عن فاتورة معين"
    button-text="فاتورة جديدة"
  >
    <template #action-button>
      <VBtn class="mx-2" @click="goToAddInvoice">
        فاتورة جديدة
      </VBtn>
    </template>

    <div v-if="store.DetailsDriverinvoice.length > 0">
      <VTable class="text-no-wrap invoice-list-table">
        <!-- 👉 Table -->
        <thead>
          <tr>
            <th scope="col">
              رقم الفاتورة
            </th>
            <th scope="col">
              التاريخ
            </th>
            <th scope="col">
              قيمة الفاتورة
            </th>
            <th scope="col">
              تفاصيل
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginationList" :key="item.id">
            <td>
              {{ item.number }}
            </td>
            <td>
              {{ new Date(item.dateCreated).toLocaleDateString() }}
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
      </VTable>
    </div>
    <div v-else class="flex justify-center p-4">
      <h3>لا يوجد بيانات</h3>
    </div>
    <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
      <span class="text-sm text-disabled" />
      <VPagination
        rounded="circle"
        v-model="pagination.pageIndex"
        class="pb-5 pt-3"
        :length="pagination.totalPages"
      />
    </div>
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'Accountant']
  </route>
