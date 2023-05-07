<script lang="ts" setup>
import Page from '@/components/shared/Page.vue';
import AddSubscription from '@/components/subscriptions/AddSubscription.vue';
import { useAppStore } from '@/stores/App';
import { useSubStore } from '@/stores/Subsecrption';

const store = useSubStore();

const  {query,paginateSubs,PagCount,pagination} = storeToRefs(store);
const headers = ['رقم الاشتراك','اسم الاشتراك','عدد المتاجر المشتركين','سعر الاشتراك','تفاصيل الاشتراك']
const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'tabler:brand-shopee',
    title: 'الاشتراكات',
  })
}
const subsecription = ref();
const closeDialog = ()=>{
  subsecription.value.closeDialog()
}
const page = ref(1);
onLoad()
</script>

<template>
  <div>
    <Page
v-model:search="query"
      ref="subsecription"
      dialog-title="إضافة اشتراك جديد"
      placeholder="ابحث عن اشتراك معين"
      button-text="اشتراك جديد"
      icon="tabler:brand-shopee"
    >
      <template #dialog-form>
        <AddSubscription  @dialog="closeDialog"/>
      </template>

      <div class="my-2">
        <VTable class="text-no-wrap invoice-list-table mt-5">
          <!-- 👉 Table head -->
          <thead>
            <tr>
        <th  v-for="(item ,index) in headers" :key="index">
            {{ item }}
              </th>
            </tr>
          </thead>
<tbody>
  <tr v-for="(item,i) in paginateSubs"
  :key="i"
  >
<td>{{item.number}}</td>
<td>{{item.name}}</td>
<td>{{item.branchesCount}}</td>
<td>{{item.price}}</td>
<td><router-link :to="`subscriptions/${item.id}`"><VIcon color="primary">tabler:dots-vertical</VIcon></router-link></td>
</tr>
</tbody>
        </VTable>
        <div class="mt-10">
          <VPagination
            v-model="pagination.pageIndex"
            :length="PagCount"
            rounded="circle"
          
          />
        </div>
      </div>
    </Page>
  <!-- !SECTION -->
  </div>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-status {
    inline-size: 11rem;
  }

  .invoice-list-search {
    inline-size: 12rem;
  }
}
</style>
