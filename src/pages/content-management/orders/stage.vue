<script lang="ts" setup>
import { useCouponStore } from '@/stores/Coupon';
import { useOrderStore } from '@/stores/Order';

const orderStore = useOrderStore();
const offerStore = useCouponStore();

onMounted(() => {
  if (orderStore.customerData?.id)
    offerStore.GetOffersNames(orderStore.customerData.id);
})

onBeforeUnmount(()=>{
  orderStore.resetOrderState();
  
})
</script>

<template>
  <div class="relative">
    <RouterView />

    <!--
 <VBtn color="primary" class="fixed left-10  bottom-24 ">
      <VIcon start icon="tabler-arrow-left" />
      التالي
    </VBtn>

    <VBtn color="primary" variant="tonal"
      class="fixed right-10  bottom-24 ">
      <VIcon start icon="tabler-arrow-right" />
      تراجع
    </VBtn>
-->
  </div>
</template>

<route lang="yaml">
</route>
<route lang="yaml">
meta:
  layout: blank
  roles: ['SuperAdmin' ,'OrderHandler' ]
</route>
