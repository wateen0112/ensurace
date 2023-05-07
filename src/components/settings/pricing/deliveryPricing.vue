<script setup lang="ts">
import { useSettingStore } from "@/stores/Setting";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { usePagination } from "@/composables/usePagination";

const store = useSettingStore();
const isDialogVisible = ref(false);
const isLoading = ref(false);
const { pricings, modifyPricingDto } = storeToRefs(useSettingStore());
const { pagination, paginate } = usePagination();

pagination.value.pageSize = 7;

const paginatedList = computed(() => paginate(pricings.value));

store.GetAllAreasPrices().then(() => {
  pagination.value.totalCount = pricings.value.length;
});
function modifyPricing() {
  isLoading.value = true;
  store.ModifyAreasPrices(modifyPricingDto.value).then(() => {
    isLoading.value = false;
    isDialogVisible.value = false;
  });
}

function openDialog(item: { id: string; extraTime: number; price: number }) {
  isDialogVisible.value = true;
  modifyPricingDto.value = {
    id: item.id,
    extraTime: item.extraTime,
    price: item.price,
  };
}
</script>

<template>
  <VCard>
    <!-- SECTION Table -->
    <h4 class="px-8 py-2 pb-0">تسعير التوصيل</h4>

    <VDialog v-model="isDialogVisible" max-width="600">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="اضافة مدينة">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <label for="order">وقت الاضافي</label>
            </VCol>
            <VCol cols="12">
              <VTextField prefix="دقيقة" v-model="modifyPricingDto.extraTime" />
            </VCol>
            <VCol cols="12">
              <label for="order">سعر التكلفة</label>
            </VCol>
            <VCol cols="12">
              <VTextField v-model="modifyPricingDto.price" />
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
          <VBtn :loading="isLoading" @click="modifyPricing"> Save </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VTable class="text-no-wrap invoice-list-table px-5">
      <!-- 👉 Table head -->
      <thead>
        <tr>
          <th scope="col">منطقة اولى</th>
          <th scope="col">منطقة ثانية</th>
          <th scope="col">تاريخ اخر تعديل</th>
          <th scope="col">وقت الاضافي</th>
          <th scope="col">سعر التكلفة</th>
          <th scope="col">الحالة</th>
          <th scope="col" class="text-center">تعديل</th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr v-for="pricing in paginatedList" :key="pricing.id">
          <!-- 👉 name area -->
          <td>{{ pricing.area1Name }}</td>
          <!-- 👉 name area -->
          <td>{{ pricing.area2Name }}</td>
          <!-- 👉 dateCreate -->
          <td>{{ new Date(pricing.dateUpdated).toLocaleDateString() }}</td>
          <!-- 👉 time -->
          <td>{{ pricing.extraTime }}</td>
          <!-- 👉 pricing -->
          <td>
            <span class="mr-6">
              {{ pricing.price == null ? "---" : pricing.price }}
            </span>
          </td>
          <!-- 👉 status -->
          <td>
            {{ pricing.price == null ? "الخدمة غير متوفرة" : "نشط" }}
          </td>
          <!-- 👉 Actions -->
          <td style="width: 7.5rem" class="text-center">
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              @click="openDialog(pricing)"
            >
              <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->

      <tfoot v-show="!pricings.length">
        <tr>
          <td colspan="8" class="text-center text-body-1">لايوجد بيانات</td>
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
