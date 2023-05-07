<script lang="ts" setup>
import { useOrderStore } from '@/stores/Order';
import { useSettingStore } from '@/stores/Setting'

const route = useRoute();
const isConfirmedOrder = computed(() => route.params.id !== '0')
const settingStore = useSettingStore()
const orderStore = useOrderStore()
const { selectedShop, confrimBranshDto } = storeToRefs(orderStore)

const isLoadingShops = ref(false)

const shopsList = computed(() => {
  // const areaId = orderStore.

  return orderStore.currentOrderAreaID ? orderStore.orderShopsList.filter(s => s.areaId === orderStore.currentOrderAreaID) : orderStore.orderShopsList

})
</script>

<template>
  <div>
    <div>
      <VList variant="elevated" class="p-2 gap-4 flex md:flex-col max-h-[720px] overflow-auto " lines="three">
        <VListSubheader>اعلام المتاجر</VListSubheader>
        <VListItem v-for="item in shopsList" :key="item.id" :disabled="isLoadingShops || !item.isOnline" density="compact"
          class="rounded-md px-1" :value="item" @click="selectedShop = item">
          <div class="flex justify-between items-center">
            <VListItemTitle>{{ item.name }}</VListItemTitle>
            <VBadge class="ml-2 absolute right-4 top-2 " dot :color="item.isOnline ? 'success' : 'error'" />
            <template v-if="isConfirmedOrder">
              <VIcon v-if="item.isConfirmed" class="text-xl" color="success">
                mdi-check
              </VIcon>
              <VIcon v-else class="text-xl" color="error">
                mdi-close
              </VIcon>
            </template>
          </div>

          <div class="flex items-center  gap-2">
            <VListItemSubtitle>
              {{ settingStore.areaName(item.areaId) }}
            </VListItemSubtitle>
          </div>
        </VListItem>
      </VList>
      <p class="text-warning my-2   align-center text-center text-xs">
        (منتجات الطلب يجب ان تكون من نفس المنطقة)
      </p>
    </div>
    <VCard v-if="isConfirmedOrder" class="p-1">
      <h4 class="py-2 text-gray-600">رقم التواصل مع المتجر </h4>
      <VTextField prepend-inner-icon="mdi-phone" readonly :model-value="selectedShop?.phoneNumber" />
      <AppDateTimePicker v-model="confrimBranshDto.estimatedTime" class="mt-4" label="مدة تحضير الطلب"
        :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i:S', time_24hr: true }" />

      <VTextarea v-model="confrimBranshDto.note" label="الملاحظات على المتجر" class="mt-4" />
    </VCard>
  </div>
</template>
