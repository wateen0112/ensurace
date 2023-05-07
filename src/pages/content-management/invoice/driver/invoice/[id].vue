<script lang="ts" setup>
import { useAppStore } from '@/stores/App';
import { useInvoiceStore } from '@/stores/Invoice';
import Page from '@/components/shared/Page.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  id: String,
});

const { invoiceDriverDto } = storeToRefs(useInvoiceStore());

const router = useRouter();

const store = useInvoiceStore();

function submit() {
  if (store.unPaidDriverInvoice.length > 0)
  invoiceDriverDto.value.orderIds = store.unPaidDriverInvoice.map(el => el.id);
  store.AddInvoiceDriver({
    orderIds: invoiceDriverDto.value.orderIds,
    outComing: +invoiceDriverDto.value.outComing,
    note: invoiceDriverDto.value.note,
  }).then(() => router.go(-1));
}

function deleteOrder(index: any) {
  store.unPaidDriverInvoice.splice(index, 1);
  invoiceDriverDto.value.orderIds.splice(index, 1);
}

function printPage() {
  window.print();
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
        <VBtn variant="tonal" color="primary" @click="submit"> حفظ </VBtn>
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
              <VTextField v-model="store.numberDriverInvoice" readonly />
              <div class="flex mx-3 text-center items-center">
                <label>تاريخ الفاتورة</label>
              </div>
              <VTextField readonly>
                {{ new Date().toLocaleDateString() }}
              </VTextField>
            </VCardText>
            <VDivider />
            <div v-if="store.unPaidDriverInvoice.length > 0">
              <VTable class="mt-4">
                <thead>
                  <tr>
                    <th scope="col" class="text-center">رقم الطلب</th>
                    <th scope="col" class="text-center">التاريخ</th>
                    <th scope="col" class="text-center">قيمة التوصل </th>
                    <th scope="col" class="text-center">نسبة/قيمة السائق</th>
                    <th scope="col" class="text-center">المستحق </th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in store.unPaidDriverInvoice" :key="index">
                    <td class="text-center">
                      {{ item.number }}
                    </td>
                    <td class="text-center">
                      {{ new Date(item.dateCreated).toLocaleDateString() }}
                    </td>
                    <td class="text-center">
                      {{ item.deliveryCost }}
                    </td>
                    <td class="text-center">
                      {{ item.driverPayment }}
                    </td>
                    <td class="text-center">
                      {{ item.outComing }}
                    </td>
                    <td class="text-center">
                      <VBtn icon size="sm" variant="text" @click="deleteOrder(index)">
                        <VIcon>mdi-close</VIcon>
                      </VBtn>
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
                  v-model="invoiceDriverDto.note"
                  label="الملاحظات"
                  class="mt-9"
                  rows="6"
                />
              </VCol>
              <VCol cols="12" lg="4" class="OrderCol">
                <div class="flex items-center">
                  <label class="w-40">عدد الطلبات</label>
                  <VTextField readonly>{{ store.unPaidDriverInvoice.length }}</VTextField>
                </div>
                <div class="flex items-center">
                  <label class="w-40">الكلفة </label>
                  <VTextField readonly>
                    {{
                      store.unPaidDriverInvoice.reduce((pre, cur) => pre + cur.deliveryCost, 0)
                    }}
                  </VTextField>
                </div>
                <VDivider class="my-2" />

                <div class="flex items-center">
                  <label class="w-40">المستحق للسائق </label>
                  <VTextField readonly>
                    {{
                      store.unPaidDriverInvoice.reduce((pre, cur) => pre + cur.outComing, 0)
                    }}
                  </VTextField>
                </div>
                <div class="flex items-center">
                  <label class="w-40">المدفوع</label>
                  <VTextField v-model="invoiceDriverDto.outComing"></VTextField>
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
    margin-top:2.5rem;
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
    roles: ['SuperAdmin' ,'Accountant']
  </route>
