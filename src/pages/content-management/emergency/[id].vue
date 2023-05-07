<script setup lang="ts">
import Page from "@/components/shared/Page.vue";
import EImage from  '@/assets/images/svg/eImage.svg'
import { useEStore } from "@/stores/EStore";
import { useAppStore } from "@/stores/App";
import router from "@/router";

const props = defineProps(["id"]);
const store = useEStore();
const { emr, reply } = storeToRefs(store);
const isLoading = ref(false);
const deleteLoding = ref(false);
useAppStore().SetPageMeta({
  title: "نظام الطوارئ | رسائل التنبيه",
  icon: "mdi-message",
  breadCrumb: [],
});
const repType = [
  {
    label: "مكالمة صوتية",
    value: "phoneCall",
  },
  {
    label: "رسالة نصية",
    value: "Sms",
  },
];
const deleteEmr = () => {
  deleteLoding.value = true;
  store
    .deleteEmr(props.id)
    .then(() => {
      deleteLoding.value = false;
      router.go(-1);
    })
    .catch(() => {
      deleteLoding.value = false;
    });
};
const handelWithDelay = () => {
  reply.value.id = props.id;

  isLoading.value = true;
  store
    .handel()
    .then(() => {
      isLoading.value = false;
      router.go(-1);
    })
    .catch(() => {
      isLoading.value = false;
    });
};
onBeforeMount(() => {
  store.getById(props.id);
});
</script>

<template>
  <Page :add="false" :has-search="false">
    <template #action-button>
      <VBtn
        class="mx-1"
        v-if="emr.reply === null || emr.reply === ''"
        @click="handelWithDelay"
        :loading="isLoading"
        variant="tonal"
        >معالجة
      </VBtn>
      <VBtn
        :loading="deleteLoding"
        @click="deleteEmr"
        class="mx-1"
        variant="tonal"
        color="error"
        >حذف
      </VBtn>
      <router-link to="../emergency"
        ><VBtn class="mx-1" variant="outlined">تراجع </VBtn></router-link
      >
    </template>
    <VCard class="min-h-[500px]">
      <VCardText>
        <div class="lg:grid gap-5 lg:grid-cols-3 flex flex-col lg:mb-0 mb-20">
          <div class="flex flex-col gap-3">
            <VTextField
              v-model="emr.number"
              :readonly="true"
              label="رقم رسالة التنبيه"
            />
            <VTextField
              v-model="emr.customerName"
              :readonly="true"
              label="اسم الزبون"
            />
            <VTextField
              v-model="emr.orderNumber"
              :readonly="true"
              label="رقم الطلب التابع لها"
            />
            <VTextField
              v-model="emr.driver.name"
              :readonly="true"
              label="اسم السائق"
            />
            <VTextField
              v-model="emr.number"
              :readonly="true"
              label="الوقت المحدد للتسليم"
            />
          </div>
          <div class="flex flex-col gap-3">
            <VTextField
              v-model="emr.dateCreated.split('T')[0]"
              :readonly="true"
              label="تاريخ ارسال رسالة التنبيه"
            />
            <VTextField
              v-model="emr.driver.phoneNumbers[0]"
              :readonly="true"
              label="رقم الموبايل"
            />
            <VTextField
              v-model="emr.address"
              :readonly="true"
              label="عنوان الطلب"
            />
            <VSelect
              :items="repType"
              item-title="label"
              item-value="value"
              v-model="reply.replayType"
              :readonly="emr.reply !== null"
              label="طريقة الرد"
            />
          </div>
          <div class="flex justify-center items-center">
            <img :src="EImage" alt="">
          </div>
          <div class="col-span-3">
            <div v-if="emr.reply === '' || emr.reply === null">
              <VTextarea
                v-model="reply.reply"
                label="الرد على الزبون"
                class="mt-10"
              />
            </div>
            <div v-else>
              <VTextarea
                :readonly="true"
                v-model="emr.reply"
                label="الرد على الزبون"
                class="my-10"
              />
              <VLabel class="mt-3">اسم الموظف صاحب الرد</VLabel>
              <VLabel>{{ emr.dashUserName }}</VLabel>
            </div>
          </div>
        </div>
      </VCardText>
    </VCard>
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'OrderHandler']
  </route>
