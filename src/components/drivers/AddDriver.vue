<script lang="ts" setup>
import { AddDriverDto } from "@/api/Driver/dto";
import { useDriverStore } from "@/stores/Driver";
import {
  emailValidator,
  requiredValidator,
  integerValidator,
  lengthValidator,
  regexValidator,
} from "@validators";
import { VForm } from "vuetify/components";
import { useSettingStore } from "@/stores/Setting";
import { BooldType } from "@/api/Driver/dto";
import { PaymentValueType } from "@/api/Driver/dto";
import FileUploader from "../shared/FileUploader.vue";
import WorkTimeInput from "../shared/WorkTimeInput.vue";
const tempData = new AddDriverDto();
const emit = defineEmits(["dialog"]);
const dto = reactive(tempData);
const refVForm = ref<InstanceType<typeof VForm>>();
const store = useDriverStore();
const isLoading = ref(false);
let phoneNumberErrors = <any>[];
const { error } = storeToRefs(store);
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
  dateCreated: "",
  address: "",
  telegramAccount: "",
  docsImage: "",
  docsUrl: "",
  imageFile: "",
  boold: "",
  imageUrl: "",
  profitType: "",
  profit: "",
  cityName: "",
  cityId: "",
  email: "",

  birthDate: "",
});

const settingStore = useSettingStore();
const { citiesList } = storeToRefs(settingStore);
const addNewDriver = () => {
  if (refVForm.value)
    refVForm.value.validate().then((result) => {
      if (result.valid) {
        isLoading.value = true;
        store.addDriver(dto.driver).then(() => {
          isLoading.value = false;
          if (!error.value) {
            emit("dialog");
          }
        });
      }
    });
};
const removePhoneNumebr = (i: number) => {
  if (i !== 0) {
    phoneNumberErrors = phoneNumberErrors.filter((item: any, index: number) => {
      return index !== i;
    });
    dto.driver.phoneNumbers = dto.driver.phoneNumbers.filter(
      (item: any, index: number) => {
        return index !== i;
      }
    );
  }
};
const addNewPhoneNumber = () => {
  dto.driver.phoneNumbers.push("");
  phoneNumberErrors.push("");
};
</script>

<template>
  <VForm ref="refVForm">
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <VTextField
            v-model="dto.driver.name"
            :rules="[requiredValidator]"
            :error-messages="errors.name"
            label="اسم السائق"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="dto.driver.telegramAccount.userName"
            :rules="[requiredValidator]"
            :error-messages="errors.telegramAccount"
            label="حساب التلغرام "
          />
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            v-model="dto.driver.cityId"
            :rules="[requiredValidator]"
            :error-messages="errors.cityId"
            clearable
            :items="citiesList"
            item-title="name"
            item-value="id"
            label="المحافظة"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="dto.driver.address"
            :rules="[requiredValidator]"
            :error-messages="errors.address"
            label="العنوان"
          />
        </VCol>
        <VCol cols="12" md="6">
          <v-text-field
            type="date"
            v-model="dto.driver.birthDate"
            :error-messages="errors.birthDate"
            :rules="[requiredValidator]"
            :preprend-inner-icon="''"
            label="   تاريخ الميلاد"
          ></v-text-field>
          <!-- <AppDateTimePicker
            v-model="dto.driver.birthDate"
            :error-messages="errors.birthDate"
            :rules="[requiredValidator]"
            :preprend-inner-icon="''"
            label="   تاريخ الميلاد"
        /> -->
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="dto.driver.email"
            :error-messages="errors.email"
            :rules="[requiredValidator, emailValidator]"
            label="  البريد الالكتروني"
          />
        </VCol>
        <VCol
          v-for="(item, index) in dto.driver.phoneNumbers"
          :key="index"
          cols="12"
          md="6"
        >
          <div>
            <div>
              <VTextField
                type="number"
                @click:append-inner="addNewPhoneNumber()"
                v-model="dto.driver.phoneNumbers[index]"
                append-inner-icon="mdi-add"
                append-inner-icon-color="primary"
                :append-icon="index !== 0 ? 'mdi-minus' : ''"
                @click:append="removePhoneNumebr(index)"
                label="رقم الموبايل"
                :rules="[
                  requiredValidator,
                  integerValidator,
                  lengthValidator(dto.driver.phoneNumbers[index], 10),
                  regexValidator(
                    dto.driver.phoneNumbers[index],
                    /[09].[^1702]{1}[0-9]{7}/
                  ),
                ]"
                :error-messages="errors.phoneNumber[index]"
              >
              </VTextField>
            </div>
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            label="زمرة الدم"
            clearable
            v-model="dto.driver.bloodType"
            :rules="[requiredValidator]"
            :error-messages="errors.blood"
            :items="bloodType"
        /></VCol>
        <VCol cols="12" md="6">
          <div>
            <VLabel class="mb-2"> صورة السائق </VLabel>
            <FileUploader
              v-model="dto.driver.imageFile"
              :rules="[requiredValidator]"
              :error-messages="errors.imageFile"
            />
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div>
            <VLabel class="mb-2"> وثائق السائق </VLabel>
            <FileUploader
              multiple
              v-model="dto.driver.docsFiles"
              :rules="[requiredValidator]"
              :error-messages="errors.docsImage"
            />
          </div>
        </VCol>
        <VCol cols="12" md="6">
          <div>
            <VLabel>ربح السائق</VLabel>

            <VRadioGroup
              v-model="dto.driver.payment.valueType"
              class="flex"
              inline
            >
              <VRadio
                label="نسبة"
                :value="PaymentValueType.Rate"
                density="compact"
              />
              <VRadio
                label="مبلغ نقدي"
                :value="PaymentValueType.Value"
                density="compact"
              />

              <VTextField
                :prefix="dto.driver.payment.valueType === 'Rate' ? '%' : ''"
                class="mx-5"
                v-model="dto.driver.payment.value"
                :rules="[requiredValidator]"
                :error-messages="errors.profit"
              />
            </VRadioGroup>
          </div>
        </VCol>

        <WorkTimeInput v-model="dto.driver.workTime" />
      </VRow>
    </VCardText>
    <div class="actions sticky bottom-0">
      <VBtn
        :rules="[requiredValidator]"
        prepend-icon="mdi-plus"
        class="my-4"
        @click="addNewDriver"
        :loading="isLoading"
      >
        إضافة
      </VBtn>
      <VBtn
        :rules="[requiredValidator]"
        color="primary"
        variant="outlined"
        @click="$emit('dialog')"
        prepend-icon="tabler:table-import"
        class="mx-4"
      >
        تراجع
      </VBtn>
    </div>
  </VForm>
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
.flat-picker-custom-style,
.flatpickr-input,
.flatpickr-mobile {
  opacity: 0;
}
</style>
