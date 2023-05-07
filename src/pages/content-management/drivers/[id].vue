<script lang="ts" setup>
import FileUploader from "@/components/shared/FileUploader.vue";
import WorkTimeInput from "@/components/shared/WorkTimeInput.vue";
import {
  emailValidator,
  requiredValidator,
  integerValidator,
  lengthValidator,
  regexValidator,
} from "@validators";
import { VForm } from "vuetify/components";
import { useDriverStore } from "@/stores/Driver";
import { useFile } from "@/composables";
import { useSettingStore } from "@/stores/Setting";
import Order from '@/components/orders/OrdersTable.vue';
import Page from "@/components/shared/Page.vue";
import { BooldType, GetDriverByIdDto } from "@/api/Driver/dto";
import { PaymentValueType } from "@/api/Driver/dto";
import DriverOrdersTable  from  '@/components/drivers/DrvierOrdersTable.vue'
let phoneNumberErrors = <any>[];
const store = useDriverStore();
const { getDriverByIdDto } = storeToRefs(store);
const { getFileUrl,openFileWindow } = useFile();
const refVForm = ref<InstanceType<typeof VForm>>();
const settingStore = useSettingStore();
const { citiesList } = storeToRefs(settingStore);
const isLoading = ref(false);

const props = defineProps(["id"]);
const bloodType = [
  BooldType.ANegative,
  BooldType.APositive,
  BooldType.AbNegative,
  BooldType.AbPositive,
  BooldType.BNegative,
  BooldType.BPositive,
  BooldType.ONegative,
  BooldType.OPositve,
];

const errors = ref<Record<string, string>>({
  name: "",

  phoneNumber: phoneNumberErrors,
  ordersCount: "",
  dateCreated: "",
  address: "",
  telegramUserName: "",
  docsImage: "",
  docsUrl: "",
  imageFile: "",
  birthDate: "",
  imageUrl: "",
  profitType: "",
  profit: "",
  cityName: "",
  cityId: "",
  email: "",
  bloodType: "",
});

const addNewPhoneNumber = () => {
  getDriverByIdDto.value.driver.phoneNumbers.push("");
  phoneNumberErrors.push("");
};

let docsUrlToDelete = <any>[];
const addDocsToDeleteList = (url: string) => {
  getDriverByIdDto.value.driver.docsUrl = getDriverByIdDto.value.driver.docsUrl.filter(
    (item: string) => {
      return item !== url;
    }
  );
  docsUrlToDelete.push(url);
};
function AddFile(payload: { file: File | any }) {
  getDriverByIdDto.value.driver.docsFiles = payload.file;
  getDriverByIdDto.value.driver.docsUrl.push(URL.createObjectURL(payload.file));
}

function getFiles(payload: { file: File | any; base64: string }) {
getDriverByIdDto.value.driver.imageUrl = URL.createObjectURL(payload.file);
getDriverByIdDto.value.driver.imageFile = payload.file;
}
const submit = () => {
  if (refVForm.value)
    refVForm.value.validate().then((result) => {
      if (result.valid) {
        let f = 0;
        getDriverByIdDto.value.driver.phoneNumbers.forEach(
          (element: any, index: number) => {
            const phoneNumberPrefix = element.slice(0, 2);
            if (phoneNumberPrefix === "09") {
              f++;
              phoneNumberErrors[index] = "";
            } else {
              phoneNumberErrors[index] = "phone number must start with 09";
            }
            if (f === getDriverByIdDto.value.driver.phoneNumbers.length) {
              getDriverByIdDto.value.driver.docsUrlToDelete = docsUrlToDelete;
              isLoading.value = true;
              store.modify().then(() => {
                isLoading.value = false;
              });
            }
          }
        );
      }
    });
};
onBeforeMount(() => {
  store.getById(props.id);
});
onBeforeUnmount(() => {
  getDriverByIdDto.value = new GetDriverByIdDto();
});
const removePhoneNumebr = (i: number) => {
  if (i !== 0) {
    phoneNumberErrors = phoneNumberErrors.filter((item: any, index: number) => {
      return index !== i;
    });
    getDriverByIdDto.value.driver.phoneNumbers = getDriverByIdDto.value.driver.phoneNumbers.filter(
      (item: any, index: number) => {
        return index !== i;
      }
    );
  }
};
</script>

<template>
  <Page :has-search="false">
    <template #action-button>
      <div class="flex justify-center items-center gap-3">
        <VBtn :loading="isLoading" variant="tonal" color="primary" @click="submit">
          تعديل
        </VBtn>
        <VBtn variant="tonal" color="error" @click="store.deleteDrivers([props.id])">
          حذف
        </VBtn>

        <VBtn variant="outlined" color="primary" @click="$router.go(-1)"> تراجع </VBtn>
      </div>
    </template>
    <VForm ref="refVForm">
      <VRow>
        <VCol cols="12" md="8">
          <VCard class="bg-transparent border">

            <VDivider />

            <VCardText class="pt-2">
              <!-- 👉 Form -->
              <div class="mt-6" inheritAttrs="getDriverByIdDto.driver">
                <VRow>
                  <!-- 👉 Drvier name  -->
                  <VCol md="6" cols="12">
                    <VTextField
                      v-model="getDriverByIdDto.driver.name"
                      label="اسم السائق"
                      :rules="[requiredValidator]"
                      :error-messages="errors.name"
                    />
                  </VCol>

                  <!-- 👉 Birthdate -->
                  <VCol md="6" cols="12">
                    <AppDateTimePicker
                      clearable
                      v-model="getDriverByIdDto.driver.birthDate"
                      :rules="[requiredValidator]"
                      :error-messages="errors.birthDate"
                      label="تاريخ الميلاد"
                    />
                  </VCol>

                  <!-- 👉 Telegram -->
                  <VCol cols="12" md="6">
                    <VTextField
                      label="حساب التيليغرام"
                      type="text"
                      v-model="getDriverByIdDto.driver.telegramAccount.userName"
                      :rules="[requiredValidator]"
                      :error-messages="errors.telegramAccount"
                    />
                  </VCol>
                  <!-- 👉 Email -->
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="getDriverByIdDto.driver.email"
                      :rules="[requiredValidator, emailValidator]"
                      :error-messages="errors.email"
                      label="البريد الالكتروني"
                      type="email"
                    />
                  </VCol>
                  <!-- 👉 Phone -->

                  <!-- 👉 Address -->
                  <VCol cols="12" md="6">
                    <VTextField
                      label="العنوان"
                      v-model="getDriverByIdDto.driver.address"
                      :rules="[requiredValidator]"
                      :error-messages="errors.address"
                    />
                  </VCol>

                  <!-- 👉 State -->
                  <VCol cols="12" md="6">
                    <VSelect
                      label="المحافظة"
                      v-model="getDriverByIdDto.driver.cityId"
                      :rules="[requiredValidator]"
                      :error-messages="errors.cityId"
                      clearable
                      item-title="name"
                      item-value="id"
                      :items="citiesList"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <div class="w-full flex gap-2 flex-row justify-end"></div>
                    <div
                      v-for="(item, index) in getDriverByIdDto.driver.phoneNumbers"
                      :key="index"
                    >
                      <VTextField
                        :class="index !== 0 ? 'my-2' : ''"
                        @click:append-inner="addNewPhoneNumber()"
                        v-model="getDriverByIdDto.driver.phoneNumbers[index]"
                        append-inner-icon="mdi-add"
                        append-inner-icon-color="primary"
                        :append-icon="index !== 0 ? 'mdi-minus' : ''"
                        @click:append="removePhoneNumebr(index)"
                        label="رقم الموبايل"
                        :rules="[
                          requiredValidator,
                          integerValidator,
                          lengthValidator(
                            getDriverByIdDto.driver.phoneNumbers[index],
                            10
                          ),
                          regexValidator(
                            getDriverByIdDto.driver.phoneNumbers[index],
                            /[09].[^1702]{1}[0-9]{7}/
                          ),
                        ]"
                        :error-messages="errors.phoneNumber[index]"
                      >
                      </VTextField>
                    </div>
                  </VCol>
                  <!-- 👉 bloodType   -->
                  <VCol cols="12" md="6">
                    <VSelect
                      label="زمرة الدم"
                      clearable
                      v-model="getDriverByIdDto.driver.bloodType"
                      :rules="[requiredValidator]"
                      :error-messages="errors.blood"
                      :items="bloodType"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <div class="px-5 py-8">
                      <VLabel>ربح السائق</VLabel>

                      <VRadioGroup
                        v-model="getDriverByIdDto.driver.payment.valueType"
                        class="flex"
                        inline
                      >
                        <VRadio
                          label="نسبة"
                          checked
                          :value="PaymentValueType.Rate"
                          density="compact"
                        />
                        <VRadio
                          label="مبلغ نقدي"
                          :value="PaymentValueType.Value"
                          density="compact"
                        />

                        <VTextField
                          :prefix="
                            getDriverByIdDto.driver.payment.valueType === 'Rate'
                              ? '%'
                              : ''
                          "
                          class="mx-5"
                          v-model="getDriverByIdDto.driver.payment.value"
                          :rules="[requiredValidator]"
                          :error-messages="errors.profit"
                        />
                      </VRadioGroup></div
                  >
               
                </VCol>
                <VCol cols="12" md="12">
                  <div class="my-3 px-5">
                    <WorkTimeInput v-model="getDriverByIdDto.driver.workTime" />
                  </div>
                </VCol>
                  <!-- 👉 Form Actions -->
                </VRow>
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <!--  dirver images  (prifle and docs )-->
        <VCol cols="12" md="4">
          <div
            class="grid lg:col-span-1 col-span-12 gap-5 p-3 shadow-lg border rounded p-5 rounded shadow-lg border"
          >
            <div class="col-span-12">
              <label class="text-sm p-2">صورة السائق</label>
              <div cols="12" class="relative">
                <VMenu>
                  <template #activator="{ props }">
                    <VBtn
                      v-bind="props"
                      class="absolute top-4 left-3"
                      icon
                      variant="flat"
                      color="primary"
                      size="x-small"
                    >
                      <VIcon icon="mdi-dots-vertical" :size="22" color="white" />
                    </VBtn>
                  </template>
  
                  <VList>
                 
                    <VListItem @click="      openFileWindow(getFiles)">
                      <VListItemTitle>تعديل صورة</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
                <img
                  v-if="getDriverByIdDto.driver.imageUrl"
                  class="w-full h-[300px] my-2"
                  :src="getFileUrl(getDriverByIdDto.driver.imageUrl)"
                >
              </div>
  
              <div class="md:col-span-4 col-span-12">
                <label class="text-sm p-2">وثائق السائق</label>
                <div
                  v-if="getDriverByIdDto.driver.docsUrl.length === 0"
                  class="flex justify-center items-center w-full"
                >
       
                  <VBtn
                  @click="
                  openFileWindow((payload) => {
                    AddFile(payload);
                  })
                "

                    color="success"
                  
                  >
                    Add Image
                  </VBtn>
                </div>
                <VCarousel
                  :show-arrows="false"
                  hide-delimiter-background
                  delimiter-icon="mdi-circle"
                  color="white"
                  height="300"
                >
                  <VCarouselItem v-for="(item, i) in getDriverByIdDto.driver.docsUrl" :key="i">
                    <VMenu class="absolute z-30">
                      <template #activator="{ props }">
                        <VBtn
                          v-bind="props"
                          class="absolute top-4 left-3"
                          icon
                          variant="flat"
                          color="primary"
                          size="x-small"
                        >
                          <VIcon icon="mdi-dots-vertical" :size="22" color="white" />
                        </VBtn>
                      </template>
  
                      <VList>
               
                        <VListItem
                       @click="  openFileWindow((payload) => {
                        AddFile(payload);
                      })"
                        >
                          <VListItemTitle>اضافة صورة</VListItemTitle>
                        </VListItem>
                        <!--
                          @click="deleteOtherUrl(item)"
                        -->
                        <VListItem >
                          <VListItemTitle>حذف صورة</VListItemTitle>
                        </VListItem>
                      </VList>
                    </VMenu>
                    <img
                      v-if="getDriverByIdDto.driver.imageUrl"
                      class="w-full h-[300px] my-2"
                      :src="getFileUrl(item)"
                    >
                  </VCarouselItem>
                </VCarousel>
              </div>
            </div>
          </div>
          
        </VCol>
        
      </VRow>
      <VRow>
    
      </VRow>
      <VCol cols="12" md="12" class="mt-10">
        <Order :orders="getDriverByIdDto.orderPagination.orders" />
      </VCol>
    </VForm>
  </Page>
</template>
<style>
.v-field__append-inner {
  color: orange;
}
.v-input__append {
  color: red;
}
.flatpickr-input {
  box-shadow: none;
}
</style>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry']
  </route>
