<script setup lang="ts">
import FileUploader from "@/components/shared/FileUploader.vue";
import { useFile } from "@/composables/index";
import { usePagination } from "@/composables/usePagination";
import { useSettingStore } from "@/stores/Setting";
import { storeToRefs } from "pinia";
import { AddCategoryDto } from "@/api/setting/dto";
import { ref } from "vue";

const { pagination, paginate } = usePagination();

pagination.value.pageSize = 6;

const { getFileUrl } = useFile();
const ids = ref<string[]>([]);
const store = useSettingStore();
const isDialogVisible = ref(false);
const isLoading = ref(false);
const { shopCategories, addCategoryDto } = storeToRefs(useSettingStore());
const paginatedList = computed(() => paginate(shopCategories.value));

store.GetAllShopCategories().then(() => {
  pagination.value.totalCount = shopCategories.value.length;
});
function addMoreCategory() {
  isLoading.value = true;
  if (addCategoryDto.value.id) {
    store
      .ModifyCategoryShop({
        name: addCategoryDto.value.name,
        imageFile: addCategoryDto.value.imageFile,
        id: addCategoryDto.value.id,
      })
      .then(() => {
        addCategoryDto.value.name = "";
        addCategoryDto.value.imageFile = null;
        addCategoryDto.value.imageUrl = "";
        addCategoryDto.value.id = "";
        isLoading.value = false;
        isDialogVisible.value = false;
      });
  } else {
    store
      .AddCategoryShop({
        name: addCategoryDto.value.name,
        imageFile: addCategoryDto.value.imageFile,
      })
      .then(() => {
        addCategoryDto.value.name = "";
        addCategoryDto.value.imageFile = null;
        addCategoryDto.value.imageUrl = "";
        isLoading.value = false;
        isDialogVisible.value = false;
      });
  }
}
function addIdsCategory(id: string) {
  ids.value.push(id);
}
function delCategories() {
  store.DeleteShopCategories(ids.value);
}
function openDialog(item: any) {
  isDialogVisible.value = true;
  addCategoryDto.value = {
    imageUrl: item.imageUrl,
    id: item.id,
    name: item.name,
    imageFile: null,
  };

  // store.ModifyCategoryShop({name:item.name,imageFile:item.imageFile,id:item.id})
}
</script>

<template>
  <VCard>
    <!-- SECTION Table -->
    <div class="px-8 py-4 pb-0 flex justify-between items-center">
      <h4>تصنيفات المتاجر</h4>
      <VDialog v-model="isDialogVisible" max-width="600">
        <template #activator="{ props }">
          <VBtn v-bind="props"> اضافة </VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <!-- Dialog Content -->
        <VCard :title="addCategoryDto.id ? 'تعديل الصنف' : 'اضافة صنف'">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <label for="order">الاسم التصنيف</label>
              </VCol>
              <VCol cols="12">
                <VTextField v-model="addCategoryDto.name" />
              </VCol>
              <VCol cols="12">
                <label for="order">صورة التصنيف</label>
              </VCol>
              <VCol cols="12">
                <FileUploader
                  v-model="addCategoryDto.imageFile"
                  v-model:url="addCategoryDto.imageUrl"
                  class="tw-flex-grow tw-w-full tw-mx-auto"
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
            <VBtn :loading="isLoading" @click="addMoreCategory"> Save </VBtn>
          </VCardText>
        </VCard>
      </VDialog>
    </div>

    <VTable class="text-no-wrap invoice-list-table px-5 pt-2">
      <!-- 👉 Table head -->
      <thead>
        <tr>
          <th scope="col">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="delCategories"
            >
              <VIcon icon="mdi-trash-can-outline" :size="22" />
            </VBtn>
          </th>
          <th scope="col">الصورة</th>
          <th scope="col">الاسم</th>
          <th scope="col" class="text-center">تاريخ الانشاء</th>
          <th scope="col" class="text-center">تعديل</th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr v-for="category in paginatedList" :key="category.id">
          <th id="check" class="text-left">
            <VCheckbox @change="addIdsCategory(category.id)" />
          </th>
          <!-- 👉 image -->
          <td>
            <img
              height="40"
              width="40"
              :src="getFileUrl(category.imageUrl)"
              class="rounded-full mt-1"
            />
          </td>
          <!-- 👉 name -->
          <td>{{ category.name }}</td>

          <!-- 👉 dateCreate -->
          <td class="text-center">
            {{ new Date(category.dateCreated).toLocaleDateString() }}
          </td>
          <td style="width: 7.5rem" class="text-center">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="openDialog(category)"
            >
              <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->

      <tfoot v-show="!shopCategories.length">
        <tr>
          <td colspan="8" class="text-center text-body-1">لايوجد بيانات</td>
        </tr>
      </tfoot>
    </VTable>
    <VPagination
      rounded="circle"
      v-model="pagination.pageIndex"
      class="py-5"
      :length="pagination.totalPages"
      :total-visible="5"
    />

    <!-- !SECTION -->
  </VCard>
</template>
