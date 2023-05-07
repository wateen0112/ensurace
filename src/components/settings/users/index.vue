<script setup lang="ts">
import { useSettingStore } from '@/stores/Setting';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { usePagination } from '@/composables/usePagination';

const store = useSettingStore();
const { pagination, paginate } = usePagination();
const { links, linkDto } = storeToRefs(useSettingStore());
const paginatedList = computed(() => paginate(links.value));
pagination.value.pageSize = 7;
const isDialogVisible = ref(false);
const isLoading = ref(false);

store.GetAllLinks().then(() => {
  pagination.value.totalCount = links.value.length;
});
function addMoreLink() {
  isLoading.value = true;
  store
    .UpsertCustomers({
      name: linkDto.value.name,
      link: linkDto.value.link,
    })
    .then(() => {
      linkDto.value.name = '';
      linkDto.value.link = '';
      isLoading.value = false;
      isDialogVisible.value = false;
    });
}
</script>

<template>
  <VCard>
    <div class="px-8 py-4 pb-0 flex justify-between items-center">
      <!-- SECTION Table -->
      <h4>روابط تواصل لدعم العملاء</h4>
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
                <label for="order">الاسم الرابط</label>
              </VCol>
              <VCol cols="12">
                <VTextField v-model="linkDto.name" />
              </VCol>
              <VCol cols="12">
                <label for="order"> الرابط</label>
              </VCol>
              <VCol cols="12">
                <VTextField v-model="linkDto.link" />
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
            <VBtn :loading="isLoading" @click="addMoreLink">
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
الاسم
</th>
          <th scope="col" class="text-center">
الرابط
</th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr v-for="link in paginatedList" :key="link.id">
          <!-- 👉 name -->
          <td>{{ link.name }}</td>

          <!-- 👉 dateCreate -->
          <td class="text-center">
{{ link.link }}
</td>
          <!-- 👉 Actions -->
        </tr>
      </tbody>

      <!-- 👉 table footer  -->

      <tfoot v-show="!links.length">
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
