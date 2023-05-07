<script lang="ts" setup>
import { useOrderStore } from '@/stores/Order';

const route = useRoute();
const orderStore = useOrderStore();
const { orderCartProducts, orderInvoice } = storeToRefs(orderStore);
const x = ref(true);
watch(
  orderCartProducts,
  (nv, ov) => {
    if (route.params.id === '0') {
      console.log(nv, ov);

      try {
        orderStore.CalcInvoice();
      }
      catch (er) {
        orderCartProducts.value = ov;
      }
    }

  },
  { deep: true },
);
</script>

<template>
  <VCard class="mt-2">
    <VExpansionPanels>
      <VExpansionPanel>
        <VExpansionPanelTitle>
          <VCardTitle>الفاتورة</VCardTitle>
        </VExpansionPanelTitle>

        <VExpansionPanelText>
          <VList>
            <VListItem>
              <div class="flex justify-between items-center">
                <VListItemTitle>تكلفة الطلب</VListItemTitle>
                <VListItemSubtitle>
                  {{ orderInvoice.coast }} ل.س
                </VListItemSubtitle>
              </div>
            </VListItem>
            <VListItem>
              <div class="flex justify-between items-center">
                <VListItemTitle>تكلفة التوصيل</VListItemTitle>
                <VListItemSubtitle>
                  {{ orderInvoice.deliveryCoast }} ل.س
                </VListItemSubtitle>
              </div>
            </VListItem>
            <VListItem>
              <div class="flex justify-between items-center">
                <VListItemTitle>الحسم</VListItemTitle>
                <VListItemSubtitle>
                  {{ orderInvoice.discount }} ل.س
                </VListItemSubtitle>
              </div>
            </VListItem>
            <VListItem>
              <div class="flex justify-between items-center">
                <VListItemTitle>الضريبة</VListItemTitle>
                <VListItemSubtitle>
                  {{ orderInvoice.tax }} ل.س
                </VListItemSubtitle>
              </div>
            </VListItem>
            <VListItem>
              <div class="flex justify-between items-center">
                <VListItemTitle class="font-weight-bold font-bold text-xl">
                  المجموع الكلي
                </VListItemTitle>
                <VListItemSubtitle class="text-xl">
                  {{ orderInvoice.total }} ل.س
                </VListItemSubtitle>
              </div>
            </VListItem>
          </VList>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </VCard>
</template>
