<script setup lang="ts">
import { useCustomerStore } from '@/stores/Customer';
import { useSettingStore } from '@/stores/Setting';
import { useOrderStore } from '@/stores/Order';
import type { CustomerSearchDTO } from '@/api/Customer/dto';
import { useApi } from '@/composables';
import { CustomerApi } from '@/api/Customer/endpoints';

const { GET } = useApi();
const orderStore = useOrderStore();
const { addressDto } = storeToRefs(useCustomerStore());
const store = useCustomerStore();
const isDialogVisible = ref(false);
const settingStore = useSettingStore();
const customerData = computed(() => orderStore.customerData);

function submit() {
  addressDto.value.customerId = customerData.value?.id as string;
  store.AddAddress({ ...addressDto.value }).then(() => {
    GET<CustomerSearchDTO>(
      CustomerApi.SearchResult,
      { id: customerData.value?.id },
      { error: true },
    );
    isDialogVisible.value = false;
  });
}

watch(isDialogVisible, (nv: boolean) => {
  if (nv === false) {
    addressDto.value.id = '';
    addressDto.value.name = '';
    addressDto.value.cityId = '';
    addressDto.value.areaId = '';
    addressDto.value.residentialAddress.building = '';
    addressDto.value.residentialAddress.details = '';
    addressDto.value.residentialAddress.floor = 0;
    addressDto.value.residentialAddress.street = '';
    addressDto.value.dormitoryAddress.numberNum = '';
    addressDto.value.dormitoryAddress.roomNum = '';
  }
});
</script>

<template>
  <VCard>
    <!-- SECTION Table -->
    <div>
      <VDialog v-model="isDialogVisible" max-width="700">
        <template #activator="{ props }">
          <VBtn v-bind="props">
            إضافة عنوان
          </VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard class="p-3" title="اضافة عنوان">
          <VForm ref="refForm" class="bg-transparent">
            <div class="grid grid-cols-12 gap-x-3 p-5">
              <div class="md:col-span-6 col-span-12">
                <VTextField v-model="addressDto.name"
                  label="اسم العنوان" />
                <VSelect v-model="addressDto.cityId"
                  :items="settingStore.cityWithArea" item-value="id"
                  item-title="name" class="mt-3" label="المدينة" />
                <VSelect v-model="addressDto.areaId" :items="
                  settingStore.cityWithArea.find((el) => el.id === addressDto.cityId)
                    ?.areas
                " item-value="id" item-title="name" class="mt-3"
                  label="المنطقة" />
              </div>
              <div v-if="
                settingStore.cityWithArea
                  .find((el) => el.id === addressDto.cityId)
                  ?.areas.find((ar) => ar.id === addressDto.areaId)?.name
                !== 'سكن جامعي'
              " class="md:col-span-6 col-span-12">
                <VTextField
                  v-model="addressDto.residentialAddress.building"
                  label="البناء" />
                <VTextField v-model="addressDto.residentialAddress.street"
                  label="الشارع" class="mt-3" />
                <VTextField v-model="addressDto.residentialAddress.floor"
                  label="الطابق" class="mt-3" />
                <VTextField v-model="addressDto.residentialAddress.details"
                  label="التفاصيل" class="mt-3" />
              </div>

              <div v-if="
                settingStore.cityWithArea
                  .find((el) => el.id === addressDto.cityId)
                  ?.areas.find((ar) => ar.id === addressDto.areaId)?.name
                === 'سكن جامعي'
              " class="md:col-span-6 col-span-12">
                <VTextField v-model="addressDto.dormitoryAddress.numberNum"
                  type="number" label="رقم الوحدة" />
                <VTextField v-model="addressDto.dormitoryAddress.roomNum"
                  type="number" class="mt-3" label="رقم الغرفة " />
              </div>
            </div>
            <VDivider />
            <div class="mt-3 flex">
              <VBtn variant="flat" color="primary" class="m-2 text-white"
                @click="submit">
                {{ addressDto.id ? "تعديل" : "إضافة" }}
              </VBtn>
              <VBtn variant="outlined" color="primary"
                class="m-2 text-white" @click="isDialogVisible = false">
                تراجع
              </VBtn>
            </div>
          </VForm>
        </VCard>
      </VDialog>
    </div>
  </VCard>
</template>
