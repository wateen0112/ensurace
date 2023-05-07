<script lang="ts" setup>
import Page from '@/components/shared/Page.vue';
import { useCouponStore } from '@/stores/Coupon';
import { useCustomerStore } from '@/stores/Customer';
import { useShopStore } from '@/stores/Shop';
import {
  VAutocomplete,
  VBtn,
  VCard,
  VCardText,
  VCol,
  VForm,
  VRadio,
  VRadioGroup,
  VRow,
  VTextarea,
  VTextField,
} from 'vuetify/components';
import { requiredValidator } from '@/@core/utils/validators';
import { getCouponByIdDto } from '@/api/Coupon/dto';
import { RouterLink } from 'vue-router';
import { useAppStore } from '@/stores/App';
import { useRouter } from 'vue-router';

const props = defineProps(['id']);
const router = useRouter();
const store = useCouponStore();
const customerStore = useCustomerStore();
const shopStore = useShopStore();
const refForm = ref<InstanceType<typeof VForm>>();
const { coupon } = storeToRefs(store);
const { CustomerName } = storeToRefs(customerStore);
const { shops, shopProducts, SearchShops } = storeToRefs(shopStore);

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'tabler:percentage',
    title: 'تفاصيل كود الحسم',
  });
};

onBeforeMount(() => {
  store.getById(props.id);
  shopStore.GetAllBranches(SearchShops.value);
  customerStore.GetNameCustomer();
  shopStore.getBranchNamesWithProducts();
});

// watch(coupon.value.branchId,()=>{
//   shopStore.GetBranchesId(coupon.value.branchId)

// })

const errors = ref<Record<string, string>>({
  name: '',
  baseOrderAmount: '',
  limit: '',
});

const submit = () => {
  refForm.value?.validate().then((res) => {
    if (res.valid) {
      if (
        coupon.value.discount.value > coupon.value.baseOrderAmount &&
        coupon.value.discount.valueType === 'Value'
      ) {
        errors.value.baseOrderAmount = 'يجب ان  يكون مقدار الحسم اصغر من الحد الأدنى ';
        errors.value.discountValue = 'يجب ان  يكون مقدار الحسم اصغر من الحد الأدنى ';
      }
      else {
        errors.value.baseOrderAmount = '';
        errors.value.discountValue = '';
        store.modify();
      }
    }
  }).then(() => router.go(-1))
};

onBeforeUnmount(() => {
  coupon.value = new getCouponByIdDto();
});
onLoad();
</script>

<template>
  <Page :has-search="false" :add="false">
    <template #header />
    <template #action-button>
      <VBtn variant="tonal" class="mx-1" @click="submit"> تعديل </VBtn>
      <VBtn
        class="mx-1"
        variant="tonal"
        color="error"
        @click="store.deleteCoupon(props.id)"
      >
        حذف
      </VBtn>
      <RouterLink to="../setting/coupons">
        <VBtn class="mx-1" variant="outlined"> تراجع </VBtn>
      </RouterLink>
    </template>
    <VForm ref="refForm">
      <VCard class="my-5">
        <VCardText class="mb-5">
          <VRow>
            <VCol cols="12" md="4">
              <div class="my-5">
                <h5 class="my-2">كود الحسم</h5>
                <VTextField
                  v-model="coupon.code"
                  disabled
                  append-inner-icon="tabler:replace"
                />
              </div>

              <div class="my-5">
                <h5 class="my-2">اسم كود الحسم</h5>
                <VTextField
                  v-model="coupon.name"
                  :rules="[requiredValidator]"
                  :error-messages="errors.name"
                />
              </div>
            </VCol>

            <VCol cols="12" md="4">
              <div class="my-5">
                <h5 class="my-2">تاريخ بداية تفعيل كود الحسم</h5>
                <AppDateTimePicker
                  :rules="[requiredValidator]"
                  v-model="coupon.dateTimeRange.start"
                  :error-messages="errors.endDate"
                />
              </div>

              <div class="mt-5">
                <h5 class="my-2">تاريخ نهاية تفعيل كود الحسم</h5>
                <AppDateTimePicker
                  :rules="[requiredValidator]"
                  v-model="coupon.dateTimeRange.end"
                  :error-messages="errors.endDate"
                />
              </div>
            </VCol>
            <VCol cols="12" md="4">
              <div class="">
                <h5 class="my-3">نوع الكود</h5>

                <div class="mt-4 mb-12">
                  <VRadioGroup
                    v-model="coupon.offerType"
                    disabled
                    class="flex"
                    inline
                  >
                    <VRadio label="لمتجر" value="Branch" density="compact" />
                    <VRadio value="Customer" label="لشخص محدد" density="compact" />
                    <VRadio value="Products" label=" لمنتجات" density="compact" />
                  </VRadioGroup>
                </div>
              </div>
              <VAutocomplete
                v-if="coupon?.offerType === 'Branch'"
                v-model="coupon.branchId"
                disabled
                label="ابحث عن متجر محدد"
                :items="shopProducts"
                item-title="name"
                item-value="id"
              />
              <div v-if="coupon?.offerType === 'Customer'">
                <h5 class="mt-2 my-2">اسم الشخص</h5>
                <VAutocomplete
                  v-model="coupon.customerId"
                  disabled
                  label="ابحث عن شخص محدد"
                  :items="CustomerName"
                  item-title="name"
                  item-value="id"
                />
              </div>
              <div v-if="coupon?.offerType === 'Products'">
                <VAutocomplete
                  v-model="coupon.branchId"
                  disabled
                  label="ابحث عن متجر محدد"
                  :items="shopProducts"
                  item-title="name"
                  item-value="id"
                />
                <VAutocomplete
                  class="my-4"
                  disabled
                  chips
                  closable-chips
                  v-model="coupon.productIds"
                  item-title="name"
                  item-value="id"
                  label="ابحث عن منتج محدد"
                  :items="shopProducts.find((el) => el.id === coupon.branchId)?.products"
                />
              </div>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" md="4">
              <div>
                <h5>الحسم</h5>

                <VRadioGroup
                  v-model="coupon.discount.valueType"
                  disabled
                  class="flex"
                  inline
                >
                  <VRadio label="نسبة" value="Percentage" density="compact" />
                  <VRadio label="مبلغ نقدي" value="Value" density="compact" />

                  <VTextField
                    v-model="coupon.discount.value"
                    disabled
                    :prefix="coupon.discount.valueType === 'Percentage' ? '%' : ''"
                    class="mx-5 my-2"
                  />
                </VRadioGroup>
              </div>
              <div class="my-5">
                <h5 class="my-2">كود الحسم على حساب</h5>

                <VRadioGroup
                  v-model="coupon.offerOn"
                  disabled
                  class="flex"
                  inline
                >
                  <VRadio label="المتجر" value="Branch" density="compact" />
                  <VRadio value="System" label=" الأدمن" density="compact" />
                </VRadioGroup>
              </div>
            </VCol>
            <VCol cols="12" md="4">
              <div class="mt-0 mb-0">
                <h5 class="my-2 mb-5">إضافة وصف عن كود الحسم</h5>
                <VTextarea v-model="coupon.description" class="mb-10 mt-14" />
              </div>
              <VRow class="mt-0">
                <VCol cols="6" md="6">
                  <h5 class="my-2">الحد الأدنى للطلب</h5>
                  <VTextField
                    v-model.number="coupon.baseOrderAmount"
                    :rules="[requiredValidator]"
                    :error-messages="errors.baseOrderAmount"
                    type="number"
                  />
                </VCol>
                <VCol cols="6" md="6">
                  <h5 class="my-2">عدد مرات الاستفادة</h5>
                  <VTextField
                    v-model.number="coupon.limit"
                    type="number"
                    :rules="[requiredValidator]"
                    :error-messages="errors.limit"
                  />
                </VCol>
              </VRow>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VForm>
  </Page>
</template>

<style>
td {
  min-width: 140px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'Marketer']
</route>
