<script setup lang="ts">
import { useSubStore } from "@/stores/Subsecrption";
import { SubscribtionDto } from "@/api/Subscription/dto";
import { VForm } from "vuetify/components";

import { requiredValidator, integerValidator } from "@/@core/utils/validators";
const refForm = ref<InstanceType<typeof VForm>>();
const tempData = new SubscribtionDto();
const isLoading = ref(false);
const dto = reactive(tempData);
const store = useSubStore();
const {error} =storeToRefs(store)

const submit = () => {
  refForm.value?.validate().then((res) => {
    if (res.valid) {
      isLoading.value = true;
      store.addSubscription(dto).then(() => {
     if (!error.value){
    
      emit("dialog");
     }
     isLoading.value = false;
 
      });
    }
  });
};
const emit = defineEmits(["dialog"]);
const errors = ref<Record<string, string>>({
  name: "",
  pricentage: "",
  price: "",
  period: "",
});
</script>

<template>
  <VForm ref="refForm">
    <VCardText>
      <div class="lg:grid flex flex-col gap-5 grid-cols-1 lg:grid-cols-2 lg:gap-4">
        <div class="">
          <VTextField
            v-model="dto.name"
            label="اسم الاشتراك"
            :rules="[requiredValidator]"
            :error-messages="errors.name"
          />
        </div>
        <div class="">
          <VTextField
            suffix="يوم"
            v-model.number="dto.period"
            type="number"
            label="مدة الاشتراك"
            :rules="[requiredValidator, integerValidator]"
            :error-messages="errors.perperiod"
          />
        </div>

        <div class="">
          <VTextField
            v-model.number="dto.price"
            type="number"
            label="سعر الاشتراك"
            :rules="[requiredValidator, integerValidator]"
            :error-messages="errors.price"
          />
        </div>

        <div class=" ">
          <VTextField
            prefix="%"
            v-model.number="dto.profitPercent"
            type="number"
            label=" نسبة الادمن  من المتجر"
            :rules="[requiredValidator, integerValidator]"
            :error-messages="errors.pricentage"
          />
        </div>

        <div class="col-span-2 mb-5">
          <VTextField label="ملاحظات " v-model="dto.note" />
        </div>
      </div>
      <div class="sticky bottom-0">
        <VBtn :loading="isLoading" @click="submit" class="mx-3">إضافة</VBtn>
        <VBtn @click="$emit('dialog')" color="primary" variant="outlined" class="mx-3">
          <VIcon>tabler:table-import</VIcon>تراجع</VBtn
        >
      </div>
    </VCardText>
  </VForm>
</template>
<style>
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

