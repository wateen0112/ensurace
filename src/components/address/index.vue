<script setup lang="ts">
import { useCustomerStore } from '@/stores/Customer';
import { useSettingStore } from '@/stores/Setting';
import { useRoute } from 'vue-router';
import { usePagination } from '@/composables/usePagination';
import type { Address } from '@/types/address';

const { pagination, paginate } = usePagination();
const { addressDto } = storeToRefs(useCustomerStore());
const { customerDetailsDto } = storeToRefs(useCustomerStore());
const paginationAdd = computed(() => paginate(customerDetailsDto.value.address));
const store = useCustomerStore();
const isDialogVisible = ref(false);
const settingStore = useSettingStore();
const router = useRoute();
const customerId = computed<string>(() => router.params.id as string);

// const isUpdate = computed(() => !!addressDto.value.id);

function submit() {
  if (addressDto.value.id) {
    store.ModifyAddress({ ...addressDto.value }).then(() => {
      addressDto.value.id = '';
      isDialogVisible.value = false;
    });
  }
  else {
    addressDto.value.customerId = customerId.value;
    store.AddAddress({ ...addressDto.value }).then(() => {
      isDialogVisible.value = false;
    });
  }
}
function openDialog(item: Address) {
  console.log('test', item);
  isDialogVisible.value = true;
  addressDto.value = { ...item, customerId: customerId.value };
}
function deleteAd(target: any) {
  store.DeleteAddress([target.id]);
}
watch(isDialogVisible, (nv: boolean) => {
  if (nv === false) {
    addressDto.value.id = '';
    addressDto.value.name = '';
    addressDto.value.areaId = '';
    addressDto.value.cityId = '';
    addressDto.value.customerId = '';
    addressDto.value.dormitoryAddress.numberNum = '';
    addressDto.value.dormitoryAddress.roomNum = '';
    addressDto.value.residentialAddress.building = '';
    addressDto.value.residentialAddress.details = '';
    addressDto.value.residentialAddress.floor = 0;
    addressDto.value.residentialAddress.street = '';
  }
});
</script>

<template>
  <VCard>
    <!-- SECTION Table -->
    <div class="px-8 py-4 pb-0 flex justify-between items-center">
      <div class="flex">
        <VIcon icon="mdi-map-marker" color="primary" class="mx-1" />
        <h4>عناوين الزبون</h4>
      </div>
      <VDialog v-model="isDialogVisible" max-width="700">
        <template #activator="{ props }">
          <VBtn v-bind="props"> إضافة عنوان </VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard class="p-3" :title="addressDto.id ? 'تعديل عنوان' : 'اضافة عنوان'">
          <VForm ref="refForm" class="bg-transparent">
            <div class="grid grid-cols-12 gap-x-3 p-5">
              <div class="md:col-span-6 col-span-12">
                <VTextField v-model="addressDto.name" label="اسم العنوان" />
                <VSelect
                  v-model="addressDto.cityId"
                  :items="settingStore.cityWithArea"
                  item-value="id"
                  item-title="name"
                  class="mt-3"
                  label="المدينة"
                />
                <VSelect
                  v-model="addressDto.areaId"
                  :items="
                    settingStore.cityWithArea.find((el) => el.id === addressDto.cityId)
                      ?.areas
                  "
                  item-value="id"
                  item-title="name"
                  class="mt-3"
                  label="المنطقة"
                />
              </div>
              <div
                v-if="
                  settingStore.cityWithArea
                    .find((el) => el.id === addressDto.cityId)
                    ?.areas.find((ar) => ar.id === addressDto.areaId)?.name !==
                  'سكن جامعي'
                "
                class="md:col-span-6 col-span-12"
              >
                <VTextField
                  v-model="addressDto.residentialAddress.building"
                  label="البناء"
                />
                <VTextField
                  v-model="addressDto.residentialAddress.street"
                  label="الشارع"
                  class="mt-3"
                />
                <VTextField
                  v-model="addressDto.residentialAddress.floor"
                  label="الطابق"
                  class="mt-3"
                />
                <VTextField
                  v-model="addressDto.residentialAddress.details"
                  label="التفاصيل"
                  class="mt-3"
                />
              </div>

              <div
                v-if="
                  settingStore.cityWithArea
                    .find((el) => el.id === addressDto.cityId)
                    ?.areas.find((ar) => ar.id === addressDto.areaId)?.name ===
                  'سكن جامعي'
                "
                class="md:col-span-6 col-span-12"
              >
                <VTextField
                  v-model="addressDto.dormitoryAddress.numberNum"
                  type="number"
                  label="رقم الوحدة"
                />
                <VTextField
                  v-model="addressDto.dormitoryAddress.roomNum"
                  type="number"
                  class="mt-3"
                  label="رقم الغرفة "
                />
              </div>
            </div>
            <VDivider />
            <div class="mt-3 flex justify-between">
              <div>
                <VBtn
                  variant="flat"
                  color="primary"
                  class="m-2 text-white"
                  @click="submit"
                >
                  {{ addressDto.id ? "تعديل" : "إضافة" }}
                </VBtn>
                <VBtn
                  variant="outlined"
                  color="primary"
                  class="m-2 text-white"
                  @click="isDialogVisible = false"
                >
                  تراجع
                </VBtn>
              </div>
              <div v-if="addressDto.id">
                <VBtn
                  class="m-2 text-white"
                  variant="flat"
                  color="error"
                  @click="deleteAd(addressDto)"
                >
                  حذف
                </VBtn>
              </div>
            </div>
          </VForm>
        </VCard>
      </VDialog>
    </div>
    <div v-if="paginationAdd.length > 0">
      <VTable class="text-no-wrap invoice-list-table px-5 pt-2">
        <!-- 👉 Table head -->
        <thead>
          <tr>
            <th scope="col">اسم العنوان</th>
            <th scope="col">اسم المدينة</th>
            <th scope="col">اسم المنطقة</th>
            <th scope="col">رقم الوحدة / اسم الشارع</th>
            <th scope="col">رقم الغرفة/ البناء</th>
            <th scope="col">الطابق</th>
            <th scope="col">التفاصيل</th>
          </tr>
        </thead>

        <!-- 👉 Table Body -->
        <tbody>
          <tr v-for="item in paginationAdd" :key="item.id">
            <td>{{ item.name }}</td>
            <td>
              {{ settingStore.citiesList.find((el) => el.id === item.cityId)?.name }}
            </td>
            <td>{{ settingStore.areas.find((el) => el.id === item.areaId)?.name }}</td>
            <td>
              {{
                item.residentialAddress?.street
                  ? item.residentialAddress?.street
                  : item.dormitoryAddress?.numberNum
              }}
            </td>
            <td>
              {{
                item.residentialAddress?.building
                  ? item.residentialAddress?.building
                  : item.dormitoryAddress?.roomNum
              }}
            </td>
            <td>
              {{ item.residentialAddress?.floor ? item.residentialAddress?.floor : "_" }}
            </td>
            <td style="width: 7.5rem">
              <VBtn
                icon
                variant="text"
                color="default"
                size="x-small"
                @click="openDialog(item)"
              >
                <VIcon icon="mdi-dots-vertical" :size="22" />
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </div>
    <div v-else class="flex justify-center">
      <h3>لا يوجد عناوين</h3>
    </div>
    <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
      <span class="text-sm text-disabled" />
      <VPagination
        v-model="pagination.pageIndex"
        class="pb-5 pt-3"
        :length="pagination.totalPages"
      />
    </div>
  </VCard>
</template>
