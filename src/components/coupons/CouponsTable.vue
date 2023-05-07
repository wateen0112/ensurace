<script setup lang="ts">
import AddCoupon from "@/components/coupons/AddCoupon.vue";
import Page from "@/components/shared/Page.vue";
import { useCouponStore } from "@/stores/Coupon";
import { useShopStore } from "@/stores/Shop";
const headers = [
  "كود الحسم",
  "اسم كود الحسم",
  "تابع ل",
  "قيمة الحسم",
  "عدد مستخدمي الكود",
  "النشاط",
  "التفاصيل",
];
const store = useCouponStore();
const closeDialog = () => {
  page.value.closeDialog();
};
const reset = () => {
  typeFilter.value = "";
  store.resetTypes();
};
const shopStore = useShopStore();
const types = [
  {
    key: "Branch",
    name: "حسب المتجر",
  },
  {
    key: "Products",
    name: "حسب المنتجات",
  },
  {
    key: "Customer",
    name: "حسب الزبون",
  },
];
const { typeFilter, query, pagCount, pagination, paginateCoupons, coupons } = storeToRefs(
  store
);
const { shops,SearchShops } = storeToRefs(shopStore);
const page = ref();
onBeforeMount(() => {
  store.getAll();
  shopStore.GetAllBranches(SearchShops.value);
});
</script>
<template>
  <Page
    ref="page"
    v-model:search="query"
    dialog-title="إضافة حسم جديد"
    placeholder="ابحث عن حسم معين"
    button-text="حسم جديد"
    icon="tabler:star"
  >
    <template #dialog-form>
      <AddCoupon @dialog="closeDialog" />
    </template>
    <div>
      <div class="my-5 grid grid-cols-12 align-center gap-x-2">
        <div class="min-w-[200px]">
          <VSelect
            :items="types"
            item-title="name"
            v-model="typeFilter"
            item-value="key"
            label="حسب النوع"
            @click:clear="reset()"
            clearable
            clear-icon="tabler-x"
          />
        </div>
      </div>
    </div>

    <VTable>
      <thead>
        <tr>
          <th v-for="(item, index) in headers" :key="index">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginateCoupons" :key="index">
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.offerType }}</td>
          <td>{{ item.discount.value }}</td>
          <td>{{ item.offerUseCount }}</td>
          <td>
            <VChip v-if="item.isActive" color="success"> نشط</VChip>
            <VChip v-else color="error">غير نشط</VChip>
          </td>
          <td>
            <router-link :to="`../coupon/${item.id}`"
              ><VIcon clolor="primary">tabler:dots-vertical</VIcon></router-link
            >
          </td>
        </tr>
      </tbody>
    </VTable>
    <div class="mt-10">
      <VPagination v-model="pagination.pageIndex" :length="pagCount" rounded="circle" />
    </div>
  </Page>
</template>
<style>
td {
  min-width: 120px;
}
</style>
