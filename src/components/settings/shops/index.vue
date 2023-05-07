<script setup lang="ts">
import { useSettingStore } from '@/stores/Setting';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { usePagination } from '@/composables/usePagination';
import LangSwitcher from '@/components/shared/LangSwitcher.vue';
import type { GetAll } from '../../../api/setting/dto';

const { pagination, paginate } = usePagination();
const store = useSettingStore();
const isDialogVisible = ref(false);
const ids = ref<string[]>([]);

const isLoading = ref(false);

pagination.value.pageSize = 7;

const { labels, labelDto } = storeToRefs(useSettingStore());

const paginatedList = computed(() => paginate(labels.value));

store.GetAllLabels().then(() => {
  pagination.value.totalCount = labels.value.length;
});
function addMoreLabels() {
  isLoading.value = true;
  if (labelDto.value.id) {
store
      .UpsertLabels({ name: labelDto.value.name, id: labelDto.value.id })
      .then(() => {
        labelDto.value.name = '';
        labelDto.value.id = '';
        isLoading.value = false;
        isDialogVisible.value = false;
      });
}
  else {
store.UpsertLabels({ name: labelDto.value.name }).then(() => {
      labelDto.value.name = '';
      labelDto.value.id = '';
      isLoading.value = false;
      isDialogVisible.value = false;
    });
}
}

function editLabel(item: GetAll) {
  isDialogVisible.value = true;
  labelDto.value.name = item.name;
  labelDto.value.id = item.id;
}
function delLabel() {
  store.DeleteLabels(ids.value);
}
function addIdLabels(id: string) {
  ids.value.push(id);
}
</script>

<template>
  <VCard>
    <div class="px-8 py-4 pb-0 flex justify-between items-center">
      <!-- SECTION Table -->
      <h4>مايقدمه المتجر</h4>
      <VDialog v-model="isDialogVisible" max-width="600">
        <template #activator="{ props }">
          <VBtn v-bind="props">
اضافة
</VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard title="اضافة منتج">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <label for="order">اسم المنتج</label>
              </VCol>
              <VCol cols="12">
                <VTextField v-model="labelDto.name" />
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
            <VBtn :loading="isLoading" @click="addMoreLabels">
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
              @click="delLabel"
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
        <tr v-for="label in paginatedList" :key="label.id">
          <th id="check" class="text-left">
            <VCheckbox @change="addIdLabels(label.id)" />
          </th>
          <!-- 👉 name -->
          <td>{{ label.name }}</td>

          <!-- 👉 dateCreate -->
          <td class="text-center">
            {{ new Date(label.dateCreated).toLocaleDateString() }}
          </td>

          <td style="width: 7.5rem" class="text-center">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="editLabel(label)"
            >
              <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->

      <tfoot v-show="!labels.length">
        <tr>
          <td colspan="8" class="text-center text-body-1">
لايوجد بيانات
</td>
        </tr>
      </tfoot>
    </VTable>
    <VPagination
      v-model="pagination.pageIndex"
      class="pb-5 pt-3"
      :length="pagination.totalPages"
      :total-visible="5"
      rounded="circle"
    />

    <!-- !SECTION -->
  </VCard>
</template>
