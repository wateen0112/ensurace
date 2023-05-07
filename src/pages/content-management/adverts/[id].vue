<script lang="ts" setup>
import Page from "@/components/shared/Page.vue";
import { useAdvertStore } from "@/stores/Advert";
import { useRouter } from "vue-router";
import { useShopStore } from "@/stores/Shop";
import { useFile } from "@/composables";

const props = defineProps({
  id: String,
});

const { getFileUrl, openFileWindow } = useFile();

const { advertDetailsDto } = storeToRefs(useAdvertStore());
const shopStore = useShopStore();

const router = useRouter();

const store = useAdvertStore();

shopStore.GetBranchName();

store.GetDetailsAdvert(props.id);

function getFiles(payload: { file: File | any; base64: string }) {
  advertDetailsDto.value.imageUrl = URL.createObjectURL(payload.file);
  advertDetailsDto.value.imageFile = payload.file;
}

function modifyAd() {
  if (advertDetailsDto.value.isToBranch === false) {
    advertDetailsDto.value.branchId = "";
    store
      .ModifyAdvert({ ...advertDetailsDto.value, id: props.id })
      .then(() => router.go(-1));
  } else {
    store
      .ModifyAdvert({ ...advertDetailsDto.value, id: props.id })
      .then(() => router.go(-1));
  }
}

function deleteAd() {
  if (props && props.id) store.DeleteAdvert([props.id]).then(() => router.go(-1));
}
</script>

<template>
  <Page :add="false" :has-search="false">
    <template #action-button>
      <div class="flex justify-center items-center gap-3">
        <VBtn variant="tonal" color="primary" @click="modifyAd"> تعديل </VBtn>
        <VBtn variant="tonal" color="error" @click="deleteAd"> حذف </VBtn>
        <VBtn variant="outlined" color="primary" @click="$router.go(-1)"> تراجع </VBtn>
      </div>
    </template>
    <div class="costumer-details">
      <!-- Details Customer -->
      <VCard prepend-icon="mdi-star" class="rounded shadow-lg border p-6">
        <template #title> تفاصيل الإعلان </template>
        <VForm class="grid lg:grid-cols-3 grid-cols-12 gap-5 p-5">
          <div class="lg:col-span-2 grid lg:grid-cols-2 gap-5 col-span-12 grid-cols-12">
            <div class="lg:col-span-1 col-span-12">
              <div class="md:col-span-4 col-span-12 flex">
                <VTextField v-model="advertDetailsDto.name" label="اسم الإعلان" />
              </div>
              <div class="md:col-span-4 col-span-12 mt-2">
                <VTextarea
                  v-model="advertDetailsDto.description"
                  class="mt-5"
                  rows="2"
                  label="وصف الإعلان "
                />
              </div>
              <div>
                <div class="mt-4">
                  <label>الإعلان تابع ل : </label>
                  <VRadioGroup
                    v-model="advertDetailsDto.isToBranch"
                    class="flex gap-4 justify-start mt-2"
                  >
                    <div class="flex">
                      <VRadio label="المتاجر" :value="true" />
                      <VRadio label=" مسؤولي النظام" :value="false" />
                    </div>
                  </VRadioGroup>
                </div>
                <VSelect
                  v-if="advertDetailsDto.isToBranch"
                  v-model="advertDetailsDto.branchId"
                  clearable
                  clear-icon="tabler-x"
                  class="mt-2"
                  label="اسم المتجر"
                  item-value="id"
                  item-title="name"
                  :items="shopStore.BranchNameList"
                />
              </div>
            </div>
            <div class="lg:col-span-1 col-span-12">
              <div class="md:col-span-4 col-span-12">
                <AppDateTimePicker
                  v-model="advertDetailsDto.dateTimeRange.start"
                  label="تاريخ بداية الإعلان "
                />
              </div>
              <div class="md:col-span-4 col-span-12 mt-2">
                <AppDateTimePicker
                  v-model="advertDetailsDto.dateTimeRange.end"
                  label="تاريخ نهاية الإعلان "
                />
              </div>
            </div>
          </div>
          <div class="lg:col-span-1 col-span-12">
            <div class="md:col-span-4 col-span-12">
              <label>صورة الإعلان</label>
              <div cols="12" class="relative">
                <VMenu>
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      class="absolute top-4 left-3"
                      icon
                      variant="text"
                      color="default"
                      size="x-small"
                    >
                      <VIcon icon="mdi-dots-vertical" :size="25" color="primary" />
                    </VBtn>
                  </template>

                  <VList>
                    <VListItem @click="openFileWindow(getFiles)">
                      <VListItemTitle>تعديل صورة</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
                <img
                  v-if="advertDetailsDto.imageUrl"
                  class="w-full h-[300px] my-2 object-cover"
                  :src="getFileUrl(advertDetailsDto.imageUrl)"
                />
              </div>
            </div>
          </div>
        </VForm>
      </VCard>
    </div>
  </Page>
</template>

<style>
.v-card-item {
  padding: 0 !important;
}
</style>

<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'Marketer ']
  </route>
