<script setup lang="ts">
import { useSettingStore } from "@/stores/Setting";
import { TaxValueType } from "@/enums/Tax";
import { storeToRefs } from "pinia";

const valRateDriver = ref(0);
const valRateCode = ref(0);
const store = useSettingStore();
const { systemDto } = storeToRefs(useSettingStore());
const loading = ref(false);
function ModifySystem() {
  loading.value = true;
  store
    .ModifySetting(systemDto.value)
    .then(() => (loading.value = false))
    .catch(() => (loading.value = false));
}
store.GetAllSettings();

// watch(valRateDriver, (val) => {});
</script>

<template>
  <VCard class="px-6 py-10">
    <VForm @submit.prevent="() => {}">
      <!-- {{systemDto}} -->
      <VRow>
        <VRow cols="12">
          <!-- 👉 Order Limit -->
          <VCol cols="6" md="6">
            <VCol cols="12">
              <label for="order">الحد الاعلى للطلب الواحد</label>
            </VCol>
            <VTextField id="orderLimit" v-model.number="systemDto.maximumOrder">
              <template #append>
                <span>s.p</span>
              </template>
            </VTextField>
          </VCol>

          <!-- 👉 Base Order Amount -->
          <VCol cols="6" md="6">
            <VCol cols="12">
              <label for="baseOrder">الحد الأدنى لقيمة الطلب الحسم</label>
            </VCol>
            <VTextField v-model.number="systemDto.offerBaseOrderAmount">
              <template #append>
                <span>s.p</span>
              </template>
            </VTextField>
          </VCol>
        </VRow>

        <VRow cols="12" class="my-8">
          <!-- 👉 Discount Used Time -->
          <VCol cols="6" md="6">
            <VCol cols="12">
              <label for="usetime">أقصى مدة للاستفادة من الحسم</label>
            </VCol>
            <VTextField v-model.number="systemDto.offerPeriod">
              <template #append>
                <span>يوم</span>
              </template>
            </VTextField>
          </VCol>
          <!-- 👉 Discount Period -->

          <VCol cols="6" md="6">
            <VCol cols="12">
              <label for="period">عدد مرات الاستفادة للشخص الواحد</label>
            </VCol>
            <VTextField v-model.number="systemDto.offerLimit">
              <template #append>
                <span>مرة</span>
              </template>
            </VTextField>
          </VCol>
        </VRow>

        <!-- 👉 default Driver Profit -->
        <VCol cols="12">
          <label for="mobile">النسب الافتراضية للربح من السائق</label>
        </VCol>
        <VCol cols="12" class="flex gap-4 justify-between">
          <VRadioGroup v-model="systemDto.driverPayment.valueType">
            <div class="flex gap-4 justify-start">
              <VRadio label="نسبة" :value="TaxValueType.Rate" />
              <VRadio label="مبلغ نقدي" :value="TaxValueType.Value" />
            </div>
          </VRadioGroup>
          <div class="w-48">
            <VTextField v-model.number="systemDto.driverPayment.value" />
          </div>
        </VCol>

        <!-- 👉 Code Discount -->
        <VCol cols="12" class="mt-8">
          <label for="mobile">حسم كود الدعوة</label>
        </VCol>
        <VCol cols="12" class="flex gap-4 justify-between">
          <VRadioGroup v-model="systemDto.offerDiscount.valueType">
            <div class="flex gap-4 justify-start">
              <VRadio label="نسبة" :value="TaxValueType.Rate" />
              <VRadio label="مبلغ نقدي" :value="TaxValueType.Value" />
            </div>
          </VRadioGroup>
          <div class="w-48">
            <VTextField v-model.number="systemDto.offerDiscount.value" />
          </div>
        </VCol>

        <VCol cols="12" class="d-flex gap-4 mt-4">
          <VBtn type="submit" :loading="loading" @click="ModifySystem">
            تعديل
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VCard>
</template>
