<script setup lang="ts">
import Page from '@/components/shared/Page.vue';
import { storeToRefs } from 'pinia';
import { useRatingStore } from '@/stores/Rating';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/stores/App';

const store = useRatingStore();
const router = useRouter();
const route = useRoute();
const { filterRate, pagination, SearchRating } = storeToRefs(useRatingStore());
const ratings = computed(() => store.ratings);
const formRate = ref<InstanceType<typeof Page> | null>(null);
pagination.value.pageSize = 10;

store.GetAllRatings();
const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'tabler-star',
    title: 'التقييمات',
  });
};
function resetFilters  (){
  filterRate.value.startDate=''
  filterRate.value.endDate=''

  store.GetAllRatings();
  
}
onLoad();
function goToDetails(id: string) {
  router.push(`/content-management/ratings/${id}`);
}
function closeForm() {
  formRate.value?.closeDialog();
}
function searchRate(e: any) {
  console.log(e);
}

// const filterEvaluation=computed(()=>ratings.value?.customers.filter(ele=>ele.))
// SearchRating
</script>

<template>
  <Page
    ref="formRate"
    v-model:search="SearchRating"
    placeholder="ابحث عن تقييم معين"
    icon="tabler-star"
    :add="false"
  >
    <div class="mb-5">
      <VRow>
        <VCol cols="10" md="6">
          <div class="flex justify-center items-center w-full">
            <div class="flex justify-center items-center w-full">
              <label class="mx-1">من</label>
              <AppDateTimePicker
                v-model="filterRate.startDate"
                @change="store.GetAllRatings()"
              />
            </div>

            <div class="flex justify-center items-center w-full mr-3">
              <label class="mx-1">إلى</label>
              <AppDateTimePicker
                v-model="filterRate.endDate"
                @change="store.GetAllRatings()"
              />
            </div>
      
          </div>

        </VCol>
        <VCol cols="2" md="6">
          <div class="flex justify-end ">  <VBtn
            icon
            variant="text"
            color="default"
            size="x-small"
            @click="resetFilters"
          >
                      <VIcon icon="tabler:rotate-clockwise" :size="26" color="success"  />
          </VBtn></div>
        </VCol>
      </VRow>
    </div>
    <VCard>
      <!-- SECTION Table -->

      <VTable class="text-no-wrap invoice-list-table px-5 pt-2">
        <!-- 👉 Table head -->
        <thead>
          <tr>
            <th scope="col">رقم الطلب</th>
            <th scope="col">اسم الزبون</th>
            <th scope="col">رقم الموبايل</th>
            <th scope="col">رقم السائق</th>
            <th scope="col">اسم المتجر</th>
            <th scope="col">حالة الطلب</th>
            <th scope="col">تفاصيل التقييم</th>
          </tr>
        </thead>

        <!-- 👉 Table Body -->
        <tbody>
          <tr v-for="rate in ratings" :key="rate.id">
            <!-- 👉 number order -->
            <td>{{ rate.number }}</td>
            <!-- 👉 name customer -->
            <td>{{ rate.customerName }}</td>
            <!-- 👉 phonenumber -->
            <td>{{ rate.customerPhoneNumber }}</td>
            <!-- 👉 name driver -->
            <td>{{ rate.driverPhoneNumber }}</td>
            <!-- 👉 branches -->
            <td>{{ rate.branchs.map((el:any)=> el.name).join(",")}}</td>
            <!-- 👉 evalution -->
            <td>
              <VChip :color="rate.isEvaluated ? 'success' : 'error'">
                {{ rate.isEvaluated ? "تم التقييم" : "لم يتم التقييم" }}
              </VChip>
            </td>
            <td style="width: 7.5rem" class="text-center">
              <VBtn
                icon
                variant="text"
                color="default"
                size="x-small"
                @click="goToDetails(rate.id)"
              >
                <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->

        <tfoot v-show="!ratings.length">
          <tr>
            <td colspan="8" class="text-center text-body-1">لايوجد بيانات</td>
          </tr>
        </tfoot>
      </VTable>
    </VCard>
    <div>
      <VPagination
        rounded="circle"
        v-model="pagination.pageIndex"
        class="py-5"
        :length="pagination.totalPages"
        :total-visible="10"
        @update:model-value="store.GetAllRatings()"
      />
    </div>
    <!-- !SECTION -->
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'OrderHandler' ]
  </route>
