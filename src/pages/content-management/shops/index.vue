<script lang="ts" setup>
import Page from '@/components/shared/Page.vue';
import AddShop from '@/components/shops/AddShop.vue';
import { useFile } from '@/composables';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/App';
import { useShopStore } from '@/stores/Shop';
import { AddShopWithBranch } from '@/api/Shop/dto';
import LangSwitcher from '@/components/shared/LangSwitcher.vue';

const { addShopDto } = storeToRefs(useShopStore());

const pageRef = ref<InstanceType<typeof Page> | null>(null);
  const search = ref('')
const router = useRouter();
const shopStore = useShopStore();
const { getFileUrl } = useFile();
const { filterDto, pagination, SearchShops } = storeToRefs(shopStore);
function filter(){
  shopStore.GetAllBranches(SearchShops.value);
}
function goToDetails(id: string) {
  router.push(`/content-management/shops/${id}`);
  console.log(id);
}

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'mdi-store',
    title: 'المتاجر',
  });
};

onLoad();
shopStore.GetAllBranches(SearchShops.value);
onBeforeUnmount(() => {
  addShopDto.value = { ...new AddShopWithBranch() };
});
</script>

<template>
  <Page
    v-model:search="SearchShops"
    dialog-title="إضافة متجر جديد"
    placeholder="ابحث عن متجر محدد"
    ref="pageRef"
    @update:search="filter"
  >          
  <LangSwitcher v-model="shopStore.lang"/>
    <template #dialog-form>
      <AddShop @close-dialog="pageRef?.closeDialog()" />
    </template>
    <div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
      >
        <div v-for="item in shopStore.shops" :key="item.id" class="shop-item">
          <VCard class="p-2 border rounded-lg">
            <VImg
              class="border rounded-lg"
              height="200"
              :src="getFileUrl(item.imageUrl)"
              cover
            />
            <VBadge
              :color="item.isOnline ? 'success' : 'error'"
              class="absolute left-8 top-8"
            />

            <VCardItem>
              <VCardTitle> {{ item.name }} - {{ item.shopName }} </VCardTitle>
              <VCardSubtitle class="mt-2">
                {{ item.category }}
              </VCardSubtitle>
              <VCardSubtitle class="mt-4">
                <VIcon icon="mdi-map-marker" /> {{ item.address }}
              </VCardSubtitle>
            </VCardItem>
            <VCardActions>
              <VBtn block variant="flat" @click="goToDetails(item.id)">
التفاصيل
</VBtn>
            </VCardActions>
          </VCard>
        </div>
      </div>
      <VPagination
        v-model="pagination.pageIndex"
        rounded="circle"
        :length="pagination.totalPages"
        :total-visible="10"
        @update:model-value="shopStore.GetAllBranches(SearchShops)"
      />
    </div>
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry' , 'OrderHandler']
</route>
