<script lang="ts" setup>
import FileUploader from '@/components/shared/FileUploader.vue';
import { useShopStore } from '@/stores/Shop';
import { useAdvertStore } from '@/stores/Advert';
import { requiredValidator } from '@validators';
import { VForm } from 'vuetify/components';
import { AddAdvert } from '@/api/Advert/dto'

const emit = defineEmits(['formSubmit']);

const refForm = ref<VForm>();
const isLoading = ref(false);
const model = ref();
const shopStore = useShopStore();
const store = useAdvertStore();
const { advertDto } = storeToRefs(useAdvertStore());

shopStore.GetBranchName();

function submit() {
  if (refForm.value?.validate()) {
    isLoading.value = true;
    store.AddAdvert(advertDto.value).then(() => {
      isLoading.value = false;
      emit('formSubmit');
      store.GetAllAdverts();
      resetAds()
    });
  }
}
function cancel() {
  emit('formSubmit');
}

function resetAds() {
  advertDto.value = new AddAdvert();
}
</script>

<template>
  <VForm ref="refForm" class="bg-transparent">
    <div class="grid grid-cols-12 gap-x-3 p-5">
      <div class="md:col-span-6 col-span-12">
        <VTextField
          v-model="advertDto.name"
          :rules="[requiredValidator]"
          label="اسم الإعلان"
        />
        <div class="mt-4">
          <label>الإعلان تابع ل : </label>
          <VRadioGroup v-model="model" class="flex gap-4 justify-start mt-2">
            <div class="flex">
              <VRadio label="المتاجر" :value="true" />
              <VRadio label=" مسؤولي النظام" :value="false" />
            </div>
          </VRadioGroup>
        </div>
        <VSelect
          v-if="model === true"
          v-model="advertDto.branchId"
          class="mt-1"
          label="اسم المتجر"
          item-value="id"
          item-title="name"
          :items="shopStore.BranchNameList"
        />
        <VTextarea
          v-model="advertDto.description"
          class="mt-5"
          rows="2"
          label="وصف الإعلان "
          :rules="[requiredValidator]"
        />
      </div>
      <div class="md:col-span-6 col-span-12">
        <AppDateTimePicker
          v-model="advertDto.dateTimeRange.start"
          label="تاريخ بداية الإعلان "
          :rules="[requiredValidator]"
        />
        <AppDateTimePicker
          v-model="advertDto.dateTimeRange.end"
          class="mt-4"
          label="تاريخ نهاية الإعلان "
          :rules="[requiredValidator]"
        />
        <div class="my-3">
          <label class="text-sm p-2 mt-4 mb-1"> صورة الإعلان</label>
          <FileUploader
            v-model="advertDto.imageFile"
            :rules="[requiredValidator]"
            class="mt-1"
          />
        </div>
      </div>
    </div>

    <VDivider />
    <div class="mt-3 flex">
      <VBtn variant="flat" color="primary" class="m-2 text-white" @click="submit">
        إضافة
      </VBtn>
      <VBtn variant="outlined" color="primary" class="m-2" @click="cancel">
تراجع
</VBtn>
    </div>
  </VForm>
</template>
