<script lang="ts" setup>
import AddAdvert from '@/components/advert/AddAdvert.vue';
import Page from '@/components/shared/Page.vue';
import { useAppStore } from '@/stores/App';
import { useAdvertStore } from '@/stores/Advert';
import { useRouter } from 'vue-router';
import { usePagination } from '@/composables/usePagination';

const { pagination, paginate } = usePagination();
const router = useRouter();
const store = useAdvertStore();
const {searchList}=storeToRefs(store)
const AdvertList = computed(() => store.AdvertList);
const paginationList = computed(() => paginate(AdvertList.value));
const selectSingalList = ref<Array<string>>([]);
const selectList = ref<Array<string>>([]);
const isMulti = ref();
const ids = ref<Array<string>>([]);

store.GetAllAdverts();

function goToDetails(id: string) {
  router.push(`/content-management/adverts/${id}`)
}

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'mdi-star',
    title: 'الإعلانات',
  });
};

onLoad();

const AdvertPage = ref<InstanceType<typeof Page> | null>(null);

function closeForm() {
  AdvertPage.value?.closeDialog();
}
function deleteById() {
  store.DeleteAdvert(selectList.value);
}

// select all singal id
function selectAll() {
  AdvertList.value?.forEach((element: any) => {
    selectSingalList.value.push(element.id);
  });
  isMulti.value = !isMulti.value;
}
function popSelectAll() {
  selectSingalList.value.splice(0, selectSingalList.value.length);
}

// select singal id
function selectAllSingal(i: any) {
  selectList.value.push(i);
}
function removeItem(rows: Array<any>) {
  ids.value = rows.map(ele => ele.id);
}
watch(selectList.value, () => {
  if (selectList.value.length > 0)
    isMulti.value = true;

  else
    isMulti.value = false;
});
</script>

<template>
  <Page ref="AdvertPage"
  v-model:search="searchList"
   dialog-title="إضافة إعلان جديد"
    placeholder="ابحث عن إعلان معين" button-text="إعلان جديد"
    icon="tabler-star">
    <template #dialog-form>
      <AddAdvert @formSubmit="closeForm" />
    </template>
    <div v-if="store.AdvertList.length > 0"
      class="w-full flex justify-end items-end px-3">
      <VBtn color="error" icon="mdi-trash" variant="plain"
        @click="deleteById" />
    </div>
    <div>
      <VTable class="text-no-wrap invoice-list-table">
        <!-- 👉 Table head -->
        <thead>
          <tr>
            <th id="check" class="text-left">
              <VCheckbox v-if="!isMulti" v-model="selectList"
                :value="selectList" color="primary" hide-details
                @change="selectAll" />
              <VCheckbox v-else v-model="isMulti" indeterminate
                color="primary" hide-details @change="popSelectAll" />
            </th>
            <th scope="col">
              رقم الإعلان
            </th>
            <th scope="col">
              اسم الإعلان
            </th>
            <th scope="col">
              تابع للمتجر
            </th>
            <th scope="col">
              بداية الإعلان
            </th>
            <th scope="col">
              نهاية الإعلان
            </th>
            <th scope="col">
              تفاصيل
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginationList" :key="item.id">
            <td id="check">
              <VCheckbox v-model="selectSingalList" color="primary"
                :value="item.id" hide-details @select="removeItem"
                @change="selectAllSingal(item.id)" />
            </td>
            <td>
              {{ item.number }}
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ item.branchName ? item.branchName : "_" }}
            </td>
            <td>
              {{ new Date(item.dateTimeRange.start).toLocaleDateString() }}
            </td>
            <td>
              {{ new Date(item.dateTimeRange.end).toLocaleDateString() }}
            </td>
            <td>
              <VBtn icon size="md" variant="text"
                @click="goToDetails(item.id)">
                <VIcon>mdi-dots-vertical</VIcon>
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </div>
    <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
      <span class="text-sm text-disabled" />
      <VPagination v-model="pagination.pageIndex"
       rounded="circle"
       class="pb-5 pt-3"
        :length="pagination.totalPages" />
    </div>
    <!-- !SECTION -->
  </Page>
</template>

<style>
.v-img__img--contain {
  object-fit: cover !important;
}
</style>

<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'Marketer ']
  </route>
