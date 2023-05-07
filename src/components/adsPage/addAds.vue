<script setup lang="ts">
import FileUploader from "@/components/shared/FileUploader.vue";
import { requiredValidator } from "@validators";
import { VForm } from "vuetify/components";

// ..............
const now = new Date();
const currentMonth = now.toLocaleString("default", { month: "2-digit" });
const currentYear = now.getFullYear();
const date = ref();
const date1 = ref();
const refForm = ref<VForm>();
const insetSwitch = ref(false);
const items = ["English", "العربية"];
const item = ["سيروجي", "سيروجي2"];
</script>

<template>
  <VForm ref="refForm" @submit.prevent="() => {}">
    <div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 m-2">
        <div class="">
          <div class="grid grid-cols-4 lg:grid-cols-2">
            <VSelect
              id="select"
              label="لغة الادخال "
              :item-value="items"
              menu-icon="mdi-web"
              :items="items"
            />
          </div>

          <div class="mt-12">
            <AppDateTimePicker
              v-model="date"
              label="تاريخ بدايةالاعلان"
              :rules="[requiredValidator]"
              :config="{
                dateFormat: 'Y-m-d',
                disable: [
                  {
                    from: `${currentYear}-${currentMonth}-20`,
                    to: `${currentYear}-${currentMonth}-25`,
                  },
                ],
              }"
            />
          </div>
          <div class="mt-6">
            <label>الاعلان تابع ل</label>
            <div class="flex">
              <label class="mt-4 mx-3">مسؤولين النظام</label>
              <VSwitch v-model="insetSwitch" inset label="المتاجر" />
            </div>
          </div>
          <div class="mt-6">
            <VSelect
              label="اسم المتجر "
              :items="item"
              :rules="[requiredValidator]"
            />
          </div>
          <div class="mt-6">
            <div class="mt-[100px]">
              <VTextarea label="  وصف الإعلان " no-resize />
            </div>
          </div>
        </div>
        <div>
          <div class="tw-mr-6">
            <VTextField label="اسم الاعلان " :rules="[requiredValidator]" />
          </div>
          <div class="tw-mr-6 mt-12">
            <AppDateTimePicker
              v-model="date1"
              label="تاريخ نهايةالاعلان"
              :rules="[requiredValidator]"
              :config="{
                dateFormat: 'Y-m-d',
                disable: [
                  {
                    from: `${currentYear}-${currentMonth}-20`,
                    to: `${currentYear}-${currentMonth}-25`,
                  },
                ],
              }"
            />
          </div>

          <div class="tw-mr-6 mt-9">
            <VLabel class="mb-2"> صورة الاعلان </VLabel>
            <FileUploader />
          </div>
        </div>
      </div>
      <div class="flex justify-start item-center">
        <VBtn class="my-4 mx-4" type="submit" @click="refForm?.validate()">
          إضافة
        </VBtn>
        <VBtn class="my-4 mx-4" variant="outlined"> تراجع </VBtn>
      </div>
    </div>
  </VForm>
</template>
