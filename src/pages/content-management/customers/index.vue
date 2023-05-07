<script lang="ts" setup>
import AddCustomer from '@/components/customers/AddCustomer.vue';
import Page from '@/components/shared/Page.vue';
import { useAppStore } from '@/stores/App';
import { useCustomerStore } from '@/stores/Customer';
import { useSettingStore } from '@/stores/Setting';
import { useRouter } from 'vue-router';

const selectSingalList = ref<Array<string>>([]);
const selectList = ref<Array<string>>([]);
const isMulti = ref();
const router = useRouter();
const store = useCustomerStore();
const settingStore = useSettingStore();
const ids = ref<Array<string>>([]);
const CustomerList = computed(() => store.CustomerList);
const { filterDto, pagination , searchCustomer } = storeToRefs(store);

function deleteById() {
  store.DeleteCustomer(selectList.value);
}

// select all singal id
function selectAll() {
  CustomerList.value?.forEach((element: any) => {
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
  ids.value = rows.map((el) => el.id);
}
watch(selectList.value, () => {
  if (selectList.value.length > 0) isMulti.value = true;
  else isMulti.value = false;
});
function goToDetails(id: string) {
  router.push(`/content-management/customers/${id}`);
}

function filterCustomer() {
store.GetAllCustomer(searchCustomer.value);

}


const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'mdi-user-circle',
    title: 'الزبائن',
  });
store.GetAllCustomer(searchCustomer.value);

};

onLoad();

const CustomerPage = ref<InstanceType<typeof Page> | null>(null);

function closeForm() {
  CustomerPage.value?.closeDialog();
}
</script>

<template>
  <Page
    ref="CustomerPage"
    v-model:search="searchCustomer"
    dialog-title="إضافة زبون جديد"
    placeholder="ابحث عن زبون معين"
    button-text="زبون جديد"
    icon="tabler-user-circle"
    @update:search="filterCustomer"
  >
    <template #dialog-form>
      <AddCustomer @formSubmit="closeForm" />
    </template>

    <div
      v-if="store.CustomerList.length > 0"
      class="w-full flex justify-end items-end px-3"
    >
      <VBtn color="error" icon="mdi-trash" variant="plain" @click="deleteById" />
    </div>
    <div v-if="store.CustomerList.length > 0">
      <VTable class="text-no-wrap invoice-list-table">
        <!-- 👉 Table head -->
        <thead>
          <tr>
            <th id="check" class="text-left">
              <VCheckbox
                v-if="!isMulti"
                v-model="selectList"
                :value="selectList"
                color="primary"
                hide-details
                @change="selectAll"
              />
              <VCheckbox
                v-else
                v-model="isMulti"
                indeterminate
                color="primary"
                hide-details
                @change="popSelectAll"
              />
            </th>
            <th scope="col">اسم الزبون</th>
            <th scope="col">رقم الموبايل</th>
            <th scope="col">المواليد</th>
            <th scope="col">المحافظة</th>
            <th scope="col">عدد الطلبات</th>
            <th scope="col">تاريخ اخر طلب</th>
            <th scope="col">تفاصيل</th>
          </tr>
        </thead>

        <!-- 👉 Table Body -->
        <tbody>
          <tr v-for="item in store.CustomerList" :key="item.id">
            <td id="check">
              <VCheckbox
                v-model="selectSingalList"
                color="primary"
                :value="item.id"
                hide-details
                @select="removeItem"
                @change="selectAllSingal(item.id)"
              />
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ item.phoneNumber }}
            </td>
            <td>
              {{ new Date(item.birthDate).toLocaleDateString() }}
            </td>
            <td>
              {{ settingStore.citiesList.find((el) => el.id === item.cityId)?.name }}
            </td>
            <td>
              {{ item.orderCount }}
            </td>
            <td>
              {{
                item.lastOrderDate
                  ? new Date(item.lastOrderDate).toLocaleDateString()
                  : "______"
              }}
            </td>
            <td>
              <VBtn icon size="lg" variant="text" @click="goToDetails(item.id)">
                <VIcon>mdi-dots-vertical</VIcon>
              </VBtn>
            </td>
          </tr>
        </tbody>
      </VTable>
    </div>
    <div v-else class="flex justify-center dark:bg-transparent bg-white p-9">
      <h2>لا يوجد بيانات</h2>
    </div>
    <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
      <span class="text-sm text-disabled" />
      <VPagination
        rounded="circle"
        v-model="pagination.pageIndex"
        :length="pagination.totalPages"
        @update:model-value="store.GetAllCustomer(searchCustomer)"
      />
    </div>
    <!-- !SECTION -->
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry']
  </route>
