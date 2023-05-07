<script lang="ts" setup>
import { useAppStore } from '@/stores/App';
import { useInvoiceStore } from '@/stores/Invoice';
import Page from '@/components/shared/Page.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  id: String,
});

const { detailsInvoiceDto } = storeToRefs(useInvoiceStore());

const router = useRouter();

const store = useInvoiceStore();

function printPage() {
  window.print();
}

function deleteInv() {
  store.DeleteInvoice([detailsInvoiceDto.value.id]).then(() => router.go(-1))
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
  <Page :add="false" :has-search="false">
    <template #action-button>
      <div class="flex justify-center items-center gap-3 print:hidden">
        <VBtn variant="tonal" color="error" @click="deleteInv"> حذف </VBtn>
        <VBtn variant="outlined" color="primary" @click="printPage"> طباعة </VBtn>
        <VBtn variant="outlined" color="error" @click="router.go(-1)"> تراجع </VBtn>
      </div>
    </template>
    <section>
      <VRow class="flex justify-center">
        <VCol cols="12" md="10">
          <VCard>
            <VCardText class="flex flex-row">
              <img class="mx-2" src="@/assets/images/logo.svg" />

              <div class="flex mx-3 text-center items-center">
                <label>رقم الفاتورة</label>
              </div>
              <VTextField v-model="detailsInvoiceDto.number" readonly />
              <div class="flex mx-3 text-center items-center">
                <label>تاريخ الفاتورة</label>
              </div>
              <VTextField :value="new Date(detailsInvoiceDto.dateCreated).toLocaleDateString()" readonly />
            </VCardText>
            <VDivider />
            <div v-if="detailsInvoiceDto.orders.length > 0">
              <VTable class="mt-4">
                <thead>
                  <tr>
                    <th scope="col" class="text-center">رقم الطلب</th>
                    <th scope="col" class="text-center">التاريخ</th>
                    <th scope="col" class="text-center">السعر الإجمالي</th>
                    <th scope="col" class="text-center">السعر الصافي(بعد الحسم)</th>
                    <th scope="col" class="text-center">نسبة الربح من المتجر</th>
                    <th scope="col" class="text-center">مستحق الشركة</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item in detailsInvoiceDto.orders" :key="item.id">
                    <td class="text-center">
                      {{ item.orderNumber }}
                    </td>
                    <td class="text-center">
                      {{ new Date(item.dateCreated).toLocaleDateString() }}
                    </td>
                    <td class="text-center">
                      {{ item.coast }}
                    </td>
                    <td class="text-center">
                      {{ item.coastWithDiscount }}
                    </td>
                    <td class="text-center">
                      {{ item.profitPercent }}
                    </td>
                    <td class="text-center">
                      {{ item.incoming }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
            <div v-else class="flex justify-center p-4"><h3>لا يوجد طلبات</h3></div>
            <VDivider class="my-2" />

            <!-- Total -->
            <VCardText
              class="flex justify-space-between flex-column flex-sm-row print-row"
            >
              <VCol cols="12" lg="8">
                <VTextarea
                  readonly
                  v-model="detailsInvoiceDto.note"
                  label="الملاحظات"
                  class="mt-9"
                  rows="6"
                />
              </VCol>
              <VCol cols="12" lg="4" class="OrderCol">
                <div class="flex items-center">
                  <label class="w-40">عدد الطلبات</label>
                  <VTextField readonly>{{ detailsInvoiceDto.orders.length }}</VTextField>
                </div>
                <div class="flex items-center">
                  <label class="w-40">السعر الصافي</label>
                  <VTextField readonly>
                    {{
                      detailsInvoiceDto.orders.reduce((pre, cur) => pre + cur.coastWithDiscount, 0)
                    }}
                  </VTextField>
                </div>
                <VDivider class="my-2" />

                <div class="flex items-center">
                  <label class="w-40">المستحق للشركة </label>
                  <VTextField readonly>
                    {{
                      detailsInvoiceDto.orders.reduce((pre, cur) => pre + cur.incoming, 0)
                    }}
                  </VTextField>
                </div>
                <div class="flex items-center">
                  <label class="w-40">المدفوع</label>
                  <VTextField readonly v-model="detailsInvoiceDto.incoming"></VTextField>
                </div>
              </VCol>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </section>
  </Page>
</template>

<style>
@media print {
  .OrderCol {
    margin-top: 2.5rem;
  }
  .layout-vertical-nav {
    display: none !important;
  }
  .layout-navbar {
    display: none !important;
  }
  .layout-content-wrapper {
    padding: 0px !important
  }
  .layout-footer {
    display: none !important;
  }
  .page-header {
    display: none !important;
  }
}
</style>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'OrderHandler' , 'DataEntry']
  </route>
