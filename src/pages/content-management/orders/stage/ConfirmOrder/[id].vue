<script lang="ts" setup>
import OrderCustomerInfo from "@/components/orders/OrderCustomerInfo.vue";
import OrderShopsSelect from "@/components/orders/OrderShopsSelect.vue";
import OrderStepper from "@/components/orders/OrderStepper.vue";
import CategoryList from "@/components/products/CategoryList.vue";
import OrderProductsCart from "@/components/orders/OrderProductsCart.vue";
import OrderInvoice from "@/components/orders/OrderInvoice.vue";
import { useOrderStore } from "@/stores/Order";
import type { CartItem } from "@/api/Order/dto";
import type { Product, ProductExtra } from "@/api/Product/dto";
import Swal from "sweetalert2";
import router from "@/router";
import { Order_Stage } from "@/enums/OrderStage";
import { useCouponStore } from "@/stores/Coupon";

const route = useRoute();

const offerStore = useCouponStore();
const cartDialog = ref(false);

const cartItemDto = ref<CartItem>({
  quantity: 1,
  branchId: "",
  id: "",
  imageUrl: "",
  name: "",
  note: "",
  price: 0,
  productExtraItems: [],
});

const extraItemsOptions = ref<ProductExtra[]>([]);

const isPrior = ref(false);
const orderStore = useOrderStore();

// const orderAreaId = computed(() => orderStore.currentOrderAreaID)

const orderID = computed(() => route.params.id as string);
const isCreate = computed(() => orderID.value === "0");
const { selectedShop, confirmOrderDto, confrimBranshDto } =
  storeToRefs(orderStore);

const selectedShopId = computed(() => selectedShop.value?.id);

const addToCartHandler = (product: Product) => {
  if (product.productExtraItems)
    extraItemsOptions.value = product.productExtraItems;
  if (selectedShopId.value) cartDialog.value = true;
  cartItemDto.value = {
    ...product,
    branchId: selectedShopId.value as string,
    quantity: 1,
    note: "",
    productExtraItems: [],
  };
};

const saveProduct = () => {
  if (cartItemDto.value.quantity > 0) {
    orderStore.AddProductToCart(cartItemDto.value);
    cartDialog.value = false;
  } else {
    Swal.fire("يرجى التأكد من الكمية");
  }
};

const onPageLoad = async () => {
  if (isCreate.value) {
    if (!orderStore.customerData.id) {
      router.replace("/content-management/orders/CustomerSearch");

      return;
    }

    orderStore.GetConfirmAdd();

    const data = await offerStore.GetOffersNames(orderStore.customerData.id);
    if (data) {
      orderStore.$patch({
        offers: data,
      });
    }
  } else {
    orderStore.GetConfirmedOrderById(orderID.value);
  }
};

watch(
  selectedShopId,
  (newValue) => {
    if (newValue) orderStore.GetProductsForSelectedShop(newValue);
  },
  { deep: true }
);

watch(isPrior, (nv) => {
  if (nv === false) confirmOrderDto.value.priorDate = null;
});

// watch(confirm, (nv) => {
//   if (nv != null) canConfirmBranch.value = true;
// });

onPageLoad();

onBeforeUnmount(() => {
  orderStore.resetOrderState();
});
</script>

<template>
  <div>
    <div class="grid lg:grid grid-cols-12 p-2 gap-2">
      <div class="hidden lg:block lg:gridcol-span-12 lg:col-span-2">
        <OrderStepper />
      </div>
      <div class="col-span-12 lg:col-span-7">
        <OrderCustomerInfo />
        <div class="grid grid-cols-12 mt-2 gap-2">
          <div class="xl:col-span-3 col-span-12">
            <OrderShopsSelect />
          </div>
          <div class="col-span-12 lg:col-span-9">
            <!-- {{ orderStore.categoriesWithProducts }} -->

            <CategoryList
              :category-list="orderStore.categoriesWithProducts"
              :branch-id="selectedShopId"
              @addProductToCart="addToCartHandler"
            />
          </div>
        </div>
      </div>
      <div class="lg:col-span-3 col-span-12">
        <OrderProductsCart />
        <OrderInvoice />
        <VCard class="p-2 mt-2">
          <template v-if="route.query.stage === Order_Stage.NewOrder">
            <div>
              <VCheckbox
                v-model="isPrior"
                direction="horizontal"
                label="الطلب مسبق"
              />
            </div>
            <div class="my-4">
              <AppDateTimePicker
                v-if="isPrior"
                v-model="confirmOrderDto.priorDate"
                label="تاريخ التسليم"
                :config="{
                  enableTime: true,
                  altInput: true,
                  altFormat: 'Y-m-d h:mK',
                  dateFormat: 'Z',
                }"
              />
            </div>
          </template>

          <VBtn
            v-if="isCreate"
            block
            variant="flat"
            :loading="orderStore.loader"
            @click="orderStore.ConfirmOrder()"
          >
            انشاء الطلب
          </VBtn>

          <VBtn
            v-else-if="selectedShopId && !isCreate"
            append-icon="mdi-cart-plus"
            size="large"
            block
            variant="tonal"
            @click="orderStore.ConfirmBranch(selectedShopId as string)"
          >
            إعلام ( {{ orderStore.selectedShop?.name }} )
          </VBtn>

          <VBtn
            v-if="selectedShopId && !isCreate"
            color="error"
            class="mt-4"
            variant="outlined"
            size="large"
            block
            @click="orderStore.DeleteOrder([route.params.id])"
          >
            حذف الطلب
          </VBtn>
        </VCard>
      </div>
    </div>

    <div class="add-to-cart-modal">
      <VDialog v-model="cartDialog" width="680">
        <DialogCloseBtn @click="cartDialog = false" />
        <VCard>
          <VCardTitle>إضافة منتج للسلة</VCardTitle>
          <VCardText>
            <VTextField v-model="cartItemDto.name" class="my-4" readonly />

            <VTextField
              v-model="cartItemDto.quantity"
              class="my-4"
              type="number"
              min="1"
              label="الكمية"
            />

            <VTextField
              v-model="cartItemDto.note"
              class="my-4"
              label="إضافة ملاحظة"
            />

            <VSelect
              v-model="cartItemDto.productExtraItems"
              class="my-4"
              multiple
              chips
              return-object
              :items="extraItemsOptions"
              label="إضافات على المنتج"
              item-title="name"
            />
          </VCardText>
          <VCardActions>
            <VBtn
              append-icon="mdi-cart-plus"
              size="large"
              block
              variant="tonal"
              @click="saveProduct"
            >
              إضافة المنتج
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  roles: [SuperAdmin, OrderHandler]
</route>
