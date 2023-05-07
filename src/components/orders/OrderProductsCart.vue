<script lang="ts" setup>
import { useFile } from '@/composables';
import { Order_Stage } from '@/enums/OrderStage';
import { useCouponStore } from '@/stores/Coupon';
import { useOrderStore } from '@/stores/Order';
import { useRoute } from 'vue-router';

const orderStore = useOrderStore();
const { getFileUrl } = useFile();
const route = useRoute();
const { confirmOrderDto, shopTab } = storeToRefs(orderStore);
const selectedShops = computed(() => orderStore.selectedShops);
const cartProducts = computed(() => orderStore.orderCartProducts);
const visibleProducts = computed(() =>
  cartProducts.value.filter(p => p.branchId === shopTab.value),
);
const offers = computed(() => orderStore.offers);
const orderStage = computed(() => route.query.stage);
const canUpdateCart = computed(
  () =>
    orderStage.value === Order_Stage.Confirmed
    || orderStage.value === Order_Stage.NewOrder,
);

watch(
  selectedShops,
  nv => {
    if (nv.length)
      shopTab.value = nv[nv.length - 1].id;
  },
  { deep: true },
);
</script>

<template>
  <VCard>
    <template v-if="selectedShops.length">
      <VTabs v-model="shopTab">
        <VTab v-for="shop in selectedShops" :key="shop.id" :value="shop.id">
        {{ shop.name }}
      </VTab>
    </VTabs>

    <VList density="comfortable" class="space-y-12 max-h-[350px] mt-4">
      <VListItem v-for="item in visibleProducts" :key="item.id">
        <div class="flex gap-3">
            <VListItemMedia>
              <VAvatar class="border mt-2" size="x-large" :image="getFileUrl(item.imageUrl)" />
            </VListItemMedia>
            <div class="flex justify-center flex-col w-full">
              <div class="flex items-center">
                <h4>
                  {{ item.name }}
                </h4>

                <div v-if="canUpdateCart" class="flex items-center gap-4 absolute left-2">
                  <VBtn icon="mdi-plus" size="2rem" variant="tonal" @click="
                    orderStore.setCartItemQuantity(item.id, item.quantity + 1)
                  " />
                  <VTextField disabled :value="item.quantity" variant="underlined" density="compact" class="w-8"
                    type="number" />
                  <VBtn icon="mdi-minus" size="2rem" variant="tonal" @click="
                    orderStore.setCartItemQuantity(item.id, item.quantity - 1)
                  " />
                  <VBtn icon="mdi-close" color="error" size="1rem" variant="plain"
                    @click="orderStore.deleteItemFromCart(item.id)" />
                </div>
              </div>
              <div class="flex mt-2 w-full justify-between items-center">
                <p v-if="item.note">
                  {{ item.note }}
                </p>
                <!--
   <VBtn v-if="
                      route.query.isConfirmedDriver === '1'
                      && route.query.receivedFromBranches === '0'
                    " class="pr-0" append-icon="mdi-pen" variant="text">
                      إضافة ملاحظات
                    </VBtn> 
  -->

                <span> {{ item.price }} ل.س </span>
              </div>
              <div v-if="item.productExtraItems?.length !== 0" class="block mt-2 w-full justify-between items-center">
                <h4>إضافات</h4>
                <div class="flex gap-5 mt-3">
                  <VChip v-for="extra in item.productExtraItems" :key="extra.id" color="primary">
                    {{ extra.name }}
                  </VChip>
                </div>
              </div>
            </div>
          </div>
        </VListItem>
      </VList>
    </template>

    <template v-else>
      <div class="flex flex-col justify-center items-center">
        <span class="ring ring-main rounded-lg p-1 my-4">
          <VIcon size="40" color="primary" icon="mdi-cart" />
        </span>
        <h3 class="text-gray-400 text-center">
          سلة المنتجات فارغة
        </h3>
      </div>
    </template>

    <div class="p-2">
      <VSelect clearable v-if="orderStage === Order_Stage.NewOrder" v-model="confirmOrderDto.offerId" :items="offers"
        item-value="id" item-title="name" label="الحسم على الطلب" @update:model-value="orderStore.CalcInvoice()" />
      <VTextField v-model="confirmOrderDto.note" :readonly="route.query.isConfirmedOrder === '1'"
        label="ملاحظات على الطلب" class="mt-4" />
    </div>
  </VCard>
</template>
