<script lang="ts" setup>
import AddEmployee from '@/components/employees/AddEmployee.vue';
import Page from '@/components/shared/Page.vue';
import { useFile } from '@/composables';
import { useAppStore } from '@/stores/App';
import { useEmployeeStore } from '@/stores/Employee';
import { useSettingStore } from '@/stores/Setting';
import { useRouter } from 'vue-router';
import { usePagination } from '@/composables/usePagination';

const { EmployeeList } = storeToRefs(useEmployeeStore());
const { getFileUrl } = useFile();
const { pagination, paginate } = usePagination();
const selectSingalList = ref<Array<string>>([]);
const selectList = ref<Array<string>>([]);
const isMulti = ref();

const router = useRouter();

const store = useEmployeeStore();
const settingStore = useSettingStore();

const paginationEmp = computed(() => paginate(EmployeeList.value));
const ids = ref<Array<string>>([]);

settingStore.GetAllCities();

store.GetAllEmployee();
function deleteById() {
  store.DeleteEmployee(selectList.value);
}

// select all singal id
function selectAll() {
  EmployeeList.value?.forEach((element: any) => {
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
  ids.value = rows.map((ele) => ele.id);
}
watch(selectList.value, () => {
  if (selectList.value.length > 0) isMulti.value = true;
  else isMulti.value = false;
});
function goToDetails(id: string) {
  router.push(`/content-management/employees/${id}`);
  console.log(id);
}

function searchEmployee(e: any) {
  store.findEmployee(e);
}

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'mdi-user',
    title: 'الموظفين',
  });
};

onLoad();

const EmployeePage = ref<InstanceType<typeof Page> | null>(null);

function closeForm() {
  EmployeePage.value?.closeDialog();
}
</script>

<template>
  <Page
    ref='EmployeePage'
    v-model:search='store.searchEmployee'
    dialog-title='إضافة موظف جديد'
    placeholder='ابحث عن موظف معين'
    button-text='موظف جديد'
    icon='tabler-user'
  >
    <template #dialog-form>
      <AddEmployee @formSubmit='closeForm' />
    </template>

    <div
      v-if='store.EmployeeList.length > 0'
      class='w-full flex justify-end items-end px-3'
    >
      <VBtn color='error' icon='mdi-trash' variant='plain' @click='deleteById' />
    </div>
    <div v-if="store.EmployeeList.length > 0">
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
            <th scope="col" />
            <th scope="col">اسم الموظف</th>
            <th scope="col">رقم الموبايل</th>
            <th scope="col">البريد الإلكتروني</th>
            <th scope="col">المواليد</th>
            <th scope="col">المحافظة</th>
            <th scope="col">العنوان</th>
            <th scope="col">عدد الطلبات المعالجة</th>
            <th scope="col">حالة الموظف</th>
            <th scope="col">تاريخ الإضافة</th>
            <th scope="col">تفاصيل</th>
          </tr>
        </thead>

        <!-- 👉 Table Body -->
        <tbody>
          <tr v-for="item in paginationEmp" :key="item.id">
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
              <VAvatar
                v-if="item.imageUrl"
                style="object-fit: cover !important"
                class="m-1"
                size="50"
                :image="getFileUrl(item.imageUrl)"
              />
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ item.phoneNumber }}
            </td>
            <td>
              {{ item.email }}
            </td>
            <td>
              {{ new Date(item.birthDate).toLocaleDateString() }}
            </td>
            <td>
              {{ settingStore.citiesList.find((el) => el.id === item.cityId)?.name }}
            </td>
            <td>
              {{ item.address }}
            </td>
            <td>
              {{ item.handledOrdersCount }}
            </td>
            <td>
              <VChip :color="item.isBlock ? 'error' : 'success'">
                {{ item.isBlock ? "محظور" : " غير محظور" }}
              </VChip>
            </td>
            <td>
              {{ new Date(item.dateCreated).toLocaleDateString() }}
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

    <!-- SECTION Pagination -->
    <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
      <!-- 👉 Pagination meta -->
      <span class="text-sm text-disabled" />

      <!-- 👉 Pagination -->
      <VPagination
        rounded="circle"
        class="pb-5 pt-3"
        v-model="pagination.pageIndex"
        :length="pagination.totalPages"
      />
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
    roles: ['SuperAdmin' ,'DataEntry']
  </route>
