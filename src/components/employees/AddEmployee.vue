<script lang="ts" setup>
import FileUploader from '@/components/shared/FileUploader.vue';
import { useEmployeeStore } from '@/stores/Employee';
import { useSettingStore } from '@/stores/Setting';
import { AddEmployee } from '@/api/Employee/dto';

import { emailValidator, passwordValidator, requiredValidator } from '@validators';

import { VForm } from 'vuetify/components';

const emit = defineEmits(['formSubmit']);

const isLoading = ref(false);

const { employeeDto } = storeToRefs(useEmployeeStore());

const refForm = ref<VForm>();

const settingStore = useSettingStore();

const store = useEmployeeStore();

function addPhone(target: any) {
  target.push('');
}
function deletePhone(item: any, id: any) {
  const s = item.findIndex((ele: any, index: any) => index === id);

  item = item.splice(s, 1);
}
function submit() {
  if (refForm.value?.validate()) {
    isLoading.value = true;
    store.AddEmployee(employeeDto.value).then(() => {
      isLoading.value = false;
      emit('formSubmit');
      store.GetAllEmployee();
      resetEmployee();
    });
  }
}
function cancel() {
  emit('formSubmit');
}

function resetEmployee() {
  employeeDto.value = new AddEmployee();
}
</script>

<template>
  <VForm ref="refForm" class="bg-transparent">
    <div class="grid grid-cols-12 gap-3 p-5">
      <div class="md:col-span-6 col-span-12">
        <VTextField
          v-model="employeeDto.name"
          label="اسم الموظف"
          :rules="[requiredValidator]"
        />
      </div>
      <div class="md:col-span-6 col-span-12">
        <VTextField
          v-model="employeeDto.userName"
          label="اسم المستخدم "
          :rules="[requiredValidator]"
        />
      </div>

      <div class="md:col-span-6 col-span-12">
        <VTextField
          v-model="employeeDto.email"
          class="mt-3"
          label="البريد الإلكتروني"
          :rules="[requiredValidator, emailValidator]"
        />
      </div>
      <div class="md:col-span-6 col-span-12">
        <VTextField
          v-model="employeeDto.password"
          class="mt-3"
          label="كلمة السر"
          :rules="[requiredValidator, passwordValidator]"
        />
      </div>

      <div class="md:col-span-6 col-span-12">
        <div class="position-relative">
          <VBtn
            size="x-small"
            icon
            style="left: 0"
            class="position-absolute bg-primary"
            @click="addPhone(employeeDto.phoneNumbers)"
          >
            <VIcon style="color: #eee">
mdi-plus
</VIcon>
          </VBtn>
          <div v-for="(itemPhone, i) in employeeDto.phoneNumbers" :key="i">
            <VBtn
              v-if="employeeDto.phoneNumbers.length > 1"
              size="x-small"
              icon
              style="top: 0; left: 2rem"
              class="delete position-absolute"
              @click="deletePhone(employeeDto.phoneNumbers, i)"
            >
              <VIcon style="color: #eee">
mdi-trash
</VIcon>
            </VBtn>
          </div>
          <div v-for="(itemPhone, i) in employeeDto.phoneNumbers" :key="i">
            <div class="mt-2">
              <label class="mx-2" for="رقم الموبايل">رقم الموبايل {{ i + 1 }}</label>
              <VTextField
                v-model="employeeDto.phoneNumbers[i]"
                label="رقم الموبايل"
                name="رقم الموبايل"
                placeholder="رقم الموبايل"
                class="mt-3"
                size="large"
              />
            </div>
          </div>
        </div>
        <VSelect
          v-model="employeeDto.cityId"
          item-value="id"
          item-title="name"
          :items="settingStore.citiesList"
          class="mt-3"
          label="المحافظة"
          :rules="[requiredValidator]"
        />
        <VTextField
          v-model="employeeDto.address"
          class="mt-3"
          label="العنوان"
          :rules="[requiredValidator]"
        />
        <VSelect
          v-model="employeeDto.role"
          item-value="name"
          item-title="name"
          :items="store.roleList"
          class="mt-3"
          label="الصلاحيات"
          :rules="[requiredValidator]"
        />
        <VTextField
          v-model="employeeDto.birthDate"
          label="تاريخ الميلاد "
          class="mt-3"
          type="date"
          :rules="[requiredValidator]"
        />
      </div>

      <div class="md:col-span-6 col-span-12">
        <label class="text-sm p-2">صورة الموظف</label>
        <FileUploader
          v-model:url="employeeDto.imageUrl"
          v-model="employeeDto.imageFile"
        />
        <label class="text-sm p-2">وثائق الموظف</label>
        <FileUploader v-model="employeeDto.docsFile" multiple />
      </div>
    </div>

    <VDivider />
    <div class="mt-3 flex">
      <VBtn
        variant="flat"
        color="primary"
        class="m-2 text-white"
        :loading="isLoading"
        @click="submit"
      >
        إضافة
      </VBtn>
      <VBtn variant="outlined" color="primary" class="m-2" @click="cancel">
تراجع
</VBtn>
    </div>
  </VForm>
</template>

<style lang="scss">
.delete {
  padding: 0 !important;
  border: none !important;
  margin: 0 !important;
  background-color: none !important;

  &:hover {
    background: none !important;
  }
}
</style>
