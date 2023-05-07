<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useShopStore } from "@/stores/Shop";
import AddShop from "@/components/shops/AddShop.vue";
import { useSettingStore } from "@/stores/Setting";
import { usePagination } from "@/composables/usePagination";

const { pagination, paginate } = usePagination();

pagination.value.pageSize = 4;

const { shopDetailsDto } = storeToRefs(useShopStore());

const paginatedList = computed(() =>
  paginate(shopDetailsDto.value.branch.otherBranches)
);

const storeSetting = useSettingStore();
const { citiesList } = storeToRefs(useSettingStore());
const store = useShopStore();
const filterVal = ref("");
const isDialogVisible = ref(false);

const filterList = computed(() => {
  if (filterVal.value)
    return paginatedList.value.filter((ele) => ele.cityId === filterVal.value);
  else return paginatedList.value;
});

function delBranch(id: string) {
  store.DeleteBranch([id], "otherBranch");
}
</script>

<template>
  <VCard class="p-5 mt-5 pb-0">
    <div class="flex items-center justify-between">
      <VLabel class="mb-2">
        فروع اخرى للمتجر ({{ shopDetailsDto.branch.otherBranches.length }})
      </VLabel>

      <VDialog v-model="isDialogVisible" max-width="800">
        <template #activator="{ props }">
          <div class="flex justify-center items-center gap-3">
            <VSelect
              v-model="filterVal"
              :items="[...citiesList, { id: 0, name: 'الكل' }]"
              item-value="id"
              item-title="name"
              placeholder="المحافظة"
              class="w-48"
            />
            <VBtn v-bind="props"> إضافة فرع </VBtn>
          </div>
        </template>

        <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

        <VCard title="اضافة فرع">
          <VCardText>
            <AddShop
              :is-branch="true"
              @close-dialog="isDialogVisible = false"
            />
          </VCardText>
        </VCard>
      </VDialog>
    </div>
    <div v-for="branch in filterList" :key="branch.id" class="flex flex-col">
      <div class="flex justify-between items-center gap-2">
        <div
          class="flex justify-between items-center border border-gray-400 rounded p-2 mt-4 w-full"
        >
          <span>{{ branch.name }}</span>
          <div class="flex justify-between items-center gap-2">
            <span class="mt-1">{{
              new Date(branch.dateCreated).toLocaleDateString()
            }}</span>

            <VRating
              v-model="branch.evaluation"
              class="w-42"
              bg-color="#808080"
              color="#FFFF00"
            />
          </div>
        </div>
        <VBtn
          class="mt-4"
          icon
          variant="text"
          color="default"
          size="x-small"
          @click="delBranch(branch.id)"
        >
          <VIcon icon="mdi-close" :size="22" color="error" />
        </VBtn>
      </div>
    </div>

    <VPagination
      v-if="filterList.length !== 0"
      v-model="pagination.pageIndex"
      class="pb-5 pt-3"
      :length="pagination.totalPages"
      :total-visible="5"
    />
    <div
      v-if="filterList.length === 0"
      class="flex justify-center items-center my-2"
    >
      <h2>لايوجد بيانات</h2>
    </div>
  </VCard>
</template>

<style>
.v-rating__wrapper {
  width: 26px !important;
}
</style>
