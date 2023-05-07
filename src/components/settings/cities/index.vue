<script setup lang="ts">
import { useSettingStore } from '@/stores/Setting';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { usePagination } from '@/composables/usePagination';
import LangSwitcher from '@/components/shared/LangSwitcher.vue';
import type { GetAll } from '../../../api/setting/dto';

const store = useSettingStore();

const { citiesList, cityDto } = storeToRefs(useSettingStore());
const { pagination, paginate } = usePagination();

pagination.value.pageSize = 7;

const ids = ref<string[]>([]);
const isDialogVisible = ref(false);
const isLoading = ref(false);
const paginatedList = computed(() => paginate(citiesList.value));

store.GetAllCities().then(() => {
  pagination.value.totalCount = citiesList.value.length;
});
function addMoreCity() {
  isLoading.value = true;
  console.log(cityDto.value.id);
  if (cityDto.value.id) {
store
      .UpsertCity({ name: cityDto.value.name, id: cityDto.value.id })
      .then(() => {
        isLoading.value = false;
        isDialogVisible.value = false;
        cityDto.value = {
          id: '',
          name: '',
        };
      });
}
  else {
store.UpsertCity({ name: cityDto.value.name }).then(() => {
      isLoading.value = false;
      isDialogVisible.value = false;
      cityDto.value = {
        id: '',
        name: '',
      };
    });
}
}
function editCity(item: GetAll) {
  isDialogVisible.value = true;
  cityDto.value.name = item.name;
  cityDto.value.id = item.id;
}

function delCities() {
  store.DeleteCities(ids.value);
}
function addIdCity(id: string) {
  ids.value.push(id);
}
</script>

<template>
  <VCard>
    <!-- SECTION Table -->
    <div class="px-8 py-4 pb-0 flex justify-between items-center">
      <h4>المدن</h4>

      <VDialog v-model="isDialogVisible" max-width="600">
        <template #activator="{ props }">
          <VBtn v-bind="props">
اضافة
</VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard title="اضافة مدينة">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <label for="order">اسم المدينة</label>
              </VCol>
              <VCol cols="12">
                <VTextField v-model="cityDto.name" />
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
            <VBtn :loading="isLoading" @click="addMoreCity">
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
              @click="delCities"
            >
              <VIcon icon="mdi-trash-can-outline" :size="22" />
            </VBtn>
          </th>
          <th scope="col">
الاسم
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
        <tr v-for="city in paginatedList" :key="city.id">
          <th id="check" class="text-left">
            <VCheckbox @change="addIdCity(city.id)" />
          </th>
          <!-- 👉 name -->
          <td>{{ city.name }}</td>

          <!-- 👉 dateCreate -->
          <td class="text-center">
            {{ new Date(city.dateCreated).toLocaleDateString() }}
          </td>
          <!-- 👉 Actions -->
          <td style="width: 7.5rem" class="text-center">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="editCity(city)"
            >
              <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->

      <tfoot v-show="!citiesList.length">
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
  </VCard>
</template>
