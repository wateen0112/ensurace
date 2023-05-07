<script setup lang="ts">
import { VForm } from 'vuetify/components';
import { requiredValidator, integerValidator } from '@/@core/utils/validators';
import { useCouponStore } from '@/stores/Coupon';
import { useCustomerStore } from '@/stores/Customer';
import { useShopStore } from '@/stores/Shop';

const store = useCouponStore();
const customerStore = useCustomerStore();
const isLoading = ref(false);
const shopStore = useShopStore();
const refForm = ref<InstanceType<typeof VForm>>();
const { coupon  , error} = storeToRefs(store);
const { CustomerList ,searchCustomer } = storeToRefs(customerStore);

const emit = defineEmits(['dialog']);

const { shops, shopProducts } = storeToRefs(shopStore);

const rendomGenerate = () => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  coupon.value.code = result;
};

const errors = ref<Record<string, string>>({
  name: '',
  code: '',
  startDate: '',
  endDate: '',
  offertType: '',
  offertOn: '',
  codeType: '',
  customerId: '',
  shopId: '',
  productId: '',
  baseOrderAmount: '',
  limit: '',
  branchId: '',
  offerType: '',
  discountValue: '',
});
onBeforeMount(() => {
  customerStore.GetAllCustomer(searchCustomer.value);
  shopStore.getBranchNamesWithProducts();
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
        isLoading.value = true;
        store.addCoupon().then(() => {
          emit('dialog');
          isLoading.value = false;
          coupon.value.branchId = ''
          coupon.value.name = ''
          coupon.value.code = ''
          coupon.value.baseOrderAmount = 0
          coupon.value.customerId = ''
          coupon.value.limit = 0
          coupon.value.productIds = ''
          coupon.value.offerType = 'Branch'
          coupon.value.dateTimeRange.start = ''
          coupon.value.dateTimeRange.end = ''
          coupon.value.discount.value = 0
          coupon.value.discount.valueType = ''
          coupon.value.description = ''
          coupon.value.offerOn = ''
        });
      }
    }
  });
};
</script>

<template>
  <VForm ref="refForm" class="mb-5">
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <div class="lg:my-5 mt-5">
            <VTextField
              label="كود الحسم"
              :rules="[requiredValidator]"
              v-model="coupon.code"
              :error-messages="errors.code"
              @click:append-inner="rendomGenerate"
              append-inner-icon="tabler:replace"
            />
          </div>

          <div class="my-5">
            <VTextField
              label="اسم كود الحسم"
              v-model="coupon.name"
              :rules="[requiredValidator]"
              :error-messages="errors.name"
            />
          </div>
        </VCol>

        <VCol cols="12" md="6">
          <div class="my-5">
            <AppDateTimePicker
              label="تاريخ بداية تفعيل كود الحسم "
              v-model="coupon.dateTimeRange.start"
              :rules="[requiredValidator]"
              :error-messages="errors.startDate"
            />
          </div>

          <div class="my-5">
            <AppDateTimePicker
              label="تاريخ نهاية تفعيل كود الحسم"
              :rules="[requiredValidator]"
              v-model="coupon.dateTimeRange.end"
              :error-messages="errors.endDate"
            />
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12" md="6">
          <div>
            <label class="my-4">الحسم</label>

            <VRadioGroup
              v-model="coupon.discount.valueType"
              class="flex pt-5 pb-3"
              inline
            >
              <VRadio label="نسبة" value="Rate" density="compact" />
              <VRadio value="Value" label="مبلغ نقدي" density="compact" />
            </VRadioGroup>
            <VTextField
              :prefix="coupon.discount.valueType === 'Rate' ? '%' : ''"
              class="lg:mx-5 max-w-[180px]"
              type="number"
              v-model.number="coupon.discount.value"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="errors.offertValue"
            />
          </div>
          <div class="my-5">
            <label class="my-2">كود الحسم على حساب :</label>

            <VRadioGroup class="block mt-2" v-model="coupon.offerOn" inline>
              <VRadio label="المتجر" value="Branch" density="compact" />
              <VRadio value="System" label=" الأدمن" density="compact" />
            </VRadioGroup>
          </div>
          <VRow class="mt-7">
            <VCol cols="6" md="6">
              <VTextField
                label="الحد الادنى للطلب"
                type="number"
                :rules="[requiredValidator, integerValidator]"
                v-model.number="coupon.baseOrderAmount"
                :error-messages="errors.baseOrderAmount"
              />
            </VCol>
            <VCol cols="6" md="6">
              <VTextField
                label="عدد مرات الاستفادة"
                :rules="[requiredValidator, integerValidator]"
                type="number"
                :error-messages="errors.limit"
                v-model.number="coupon.limit"
              />
            </VCol>
          </VRow>
        </VCol>
        <VCol cols="12" md="6">
          <div class="mt-20 lg:mt-2 mb-3">
            <VTextarea v-model="coupon.description" label="إضافة وصف " />
          </div>

          <div>
            <label class="mt-3">نوع الكود</label>

            <VRadioGroup
              :rules="[requiredValidator]"
              :error-messages="errors.offerType"
              v-model="coupon.offerType"
              class="flex mt-3"
              inline
            >
              <VRadio value="Branch" label="لمتجر" density="compact" />
              <VRadio value="Customer" label="لشخص محدد" density="compact" />
              <VRadio value="Products" label=" لمنتجات" density="compact" />
            </VRadioGroup>
          </div>
          <VAutocomplete
            class="mt-3"
            :rules="[requiredValidator]"
            :error-messages="errors.productId"
            v-if="coupon.offerType === 'Branch'"
            label="ابحث عن متجر محدد"
            :items="shopProducts"
            v-model="coupon.branchId"
            item-title="name"
            item-value="id"
          />
          <div v-if="coupon.offerType === 'Customer'">
            <VAutocomplete
              class="mt-3"
              v-model="coupon.customerId"
              :rules="[requiredValidator]"
              :items="CustomerList"
              item-title="name"
              item-value="id"
              :error-messages="errors.customerId"
              label="ابحث عن شخص محدد"
            />
          </div>
          <div v-if="coupon.offerType === 'Products'">
            <VAutocomplete
              class="mt-3"
              :rules="[requiredValidator]"
              :error-messages="errors.productId"
              v-model="coupon.branchId"
              label="ابحث عن متجر محدد"
              :items="shopProducts"
              item-title="name"
              item-value="id"
            />

            <VAutocomplete
              class="mt-3"
              multiple
              chips
              closable-chips
              :rules="[requiredValidator]"
              v-model="coupon.productsIds"
              :error-messages="errors.branchId"
              label="ابحث عن منتج محدد"
              :items="shopProducts.find((el) => el.id === coupon.branchId)?.products"
              item-title="name"
              item-value="id"
            />
          </div>
        </VCol>
      </VRow>
    </VCardText>
    <div class="sticky bottom-1">
      <VBtn class="mx-3 mt-5" color="primary" :loading="isLoading" @click="submit"
        >إضافة</VBtn
      >
      <VBtn class="mx-3 mt-5" color="primary" variant="outlined" @click="$emit('dialog')">
        تراجع <VIcon>tabler:table-import</VIcon></VBtn
      >
    </div>
  </VForm>
</template>

<style>
.v-field__append-inner {
  color: black;
}
.v-input__append {
  color: black;
}
.v-radio-group > .v-input__control {
  flex-direction: row;
}
.v-messages__message {
  min-height: 40px;
}
.v-col-md-6,
.v-col-12 {
  padding: 0px 10px;
}
</style>
