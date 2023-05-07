<script setup lang="ts">
import { useSettingStore } from '@/stores/Setting';
import { storeToRefs } from 'pinia';
import { usePagination } from '@/composables/usePagination';
import type { GetAllArea } from '@/api/setting/dto';

const { pagination, paginate } = usePagination();

pagination.value.pageSize = 7;

const { areas, citiesList, areaDto } = storeToRefs(useSettingStore());

const paginatedListAreas = computed(() => paginate(areas.value));
const store = useSettingStore();
const isDialogVisible = ref(false);
const isLoading = ref(false);
const ids = ref<string[]>([]);

store.GetAllAreas().then(() => {
  pagination.value.totalCount = areas.value.length;
});
store.GetAllCities();
function upsertMoreArea() {
  isLoading.value = true;
  if (areaDto.value.id) {
store.UpsertAreas(areaDto.value).then(() => {
      isLoading.value = false;
      areaDto.value.cityId = '';
      areaDto.value.name = '';
      areaDto.value.id = '';
      isDialogVisible.value = false;
    });
}
  else {
store.UpsertAreas({ name: areaDto.value.name, cityId: areaDto.value.cityId })
      .then(() => {
        isLoading.value = false;
        areaDto.value.cityId = '';
        areaDto.value.name = '';
        areaDto.value.id = '';
        isDialogVisible.value = false;
      });
}
}
function editArea(item: GetAllArea) {
  isDialogVisible.value = true;
  areaDto.value.cityId = item.cityId;
  areaDto.value.name = item.name;
  areaDto.value.id = item.id;
}
function addIdAreas(id: string) {
  ids.value.push(id);
}
function delArea() {
  store.DeleteAreas(ids.value);
}
</script>

<template>
  <VCard>
    <!-- SECTION Table -->
    <div class="px-8 py-4 pb-0 flex justify-between items-center">
      <h4>المناطق</h4>
      <VDialog v-model="isDialogVisible" max-width="600">
        <template #activator="{ props }">
          <VBtn v-bind="props">
          اضافة
          </VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard :title="areaDto.id !== '' ? 'تفاصيل المنطقة' : 'إضافة المنطقة'">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <label for="order">اسم المنطقة</label>
              </VCol>
              <VCol cols="12">
                <VTextField v-model="areaDto.name" />
              </VCol>
              <VCol cols="12">
                <label for="order"> المدينة</label>
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="areaDto.cityId"
                  :items="citiesList"
                  item-value="id"
                  item-title="name"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn
              variant="tonal"
              color="secondary"
              @click="isDialogVisible = false"
            >
              Close
            </VBtn>
            <VBtn :loading="isLoading" @click="upsertMoreArea">
            Save
            </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </div>

    <VTable class="text-no-wrap invoice-list-table px-5">
      <!-- 👉 Table head -->
      <thead>
        <tr>
          <th scope="col">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="delArea"
            >
              <VIcon icon="mdi-trash-can-outline" :size="22" />
            </VBtn>
          </th>
          <th scope="col">
          الاسم
          </th>
          <th scope="col">
          الاسم المدينة
          </th>
          <th scope="col" class="text-center">
          تاريخ الانشاء
          </th>
          <th scope="col" class="text-center">
          تعديل
          </th>
        </tr>
      </thead>
      <!-- 👉 Table Body -->
      <tbody>
        <tr v-for="area in paginatedListAreas" :key="area.id">
          <th id="check" class="text-left">
            <VCheckbox @change="addIdAreas(area.id)" />
          </th>
          <!-- 👉 name -->
          <td>{{ area.name }}</td>
          <!-- 👉 city -->
          <td>{{ area.cityName }}</td>

          <!-- 👉 dateCreate -->
          <td class="text-center">
            {{ new Date(area.dateCreated).toLocaleDateString() }}
          </td>
          <!-- 👉 Actions -->
          <td style="width: 7.5rem" class="text-center">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="editArea(area)"
            >
              <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->

      <tfoot v-show="!areas.length">
        <tr>
          <td colspan="8" class="text-center text-body-1">
          لايوجد بيانات
          </td>
        </tr>
      </tfoot>
    </VTable>
    <VPagination
      v-model="pagination.pageIndex"
      rounded="circle"
      class="pb-5 pt-3"
      :length="pagination.totalPages"
      :total-visible="5"
    />

    <!-- !SECTION -->
  </VCard>
</template>
