<script lang="ts" setup>
import { useOrderStore } from '@/stores/Order';

const orderStore = useOrderStore();
const route = useRoute();
const selectedAddress = computed(() =>
  route.params.id === '0'
    ? orderStore.addresses?.find(a => a.id === orderStore.selectedAddress)?.text
    : orderStore.customerData.address,
);
</script>

<template>
  <VCard
    class="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between p-4">
    <VCardTitle>معلومات الزبون</VCardTitle>
      <div class="flex gap-4">
        <div class="flex items-center gap-2">
          <VIcon color="primary" icon="mdi-account-circle-outline" />
          <span>
            {{ orderStore.customerData?.name }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <VIcon color="primary" icon="mdi-phone" />
          <span>
            {{ orderStore.customerData?.phoneNumber }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <VIcon color="primary" icon="mdi-order-numeric-ascending" />

          <span>رقم الطلب : </span>
          <span>
            {{ orderStore.customerData?.orderNumber }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <VIcon color="primary" icon="mdi-map-marker" />
          <span>
            {{ selectedAddress }}
          </span>
        </div>
      </div>
      <div>
      </div>
  </VCard>
</template>
