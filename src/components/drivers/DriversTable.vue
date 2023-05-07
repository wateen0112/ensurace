<script lang="ts" setup>
import AddDriver from "@/components/drivers/AddDriver.vue";
import Page from "@/components/shared/Page.vue";
import { useAppStore } from "@/stores/App";
import { useDriverStore } from "@/stores/Driver";
import AppDateTimePicker from "@core/components/AppDateTimePicker.vue";
import { useFile } from "@/composables";

const store = useDriverStore();
const idsToBeDeleted = ref<string[]>([]);

const { startDate, endDate, query, status } = storeToRefs(store);
const { getFileUrl } = useFile();
const { paginateDrivers, pagination, PagCount } = storeToRefs(store);
const closeDialog = () => {
  page.value.closeDialog();
};
const statusList = [
  {
    key: "Available",
    title: "متاح",
  },
  {
    key: "Busy",
    title: "مشغول",
  },
];

const reset = () => {
  query.value = "";
  store.filterReset();
};

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "tabler:car",
    title: "السائقين",
  });
};

const selected = ref<boolean>(false);
const page = ref();
const headers = [
  "صورة السائق",
  " اسم  السائق",
  "   رقم الموبايل",
  " حالة  السائق",
  "   عدد الطلبات",
  "  تاريخ بدء العمل",
  "     عنوان  السائق",
  "   تفاصيل",
];

// methodes and funcitons  . . .

onLoad();
</script>

<template>
  <div>
    <Page
      ref="page"
      v-model:search="query"
      dialog-title="إضافة سائق جديد"
      placeholder="ابحث عن سائق معين"
      button-text="سائق جديد"
      icon="tabler-baby-carriage"
    >
      <template #dialog-form>
        <AddDriver @dialog="closeDialog" />
      </template>
      <div>
        <VRow>
          <VCol cols="12" md="4">
            <VSelect
              label="فلترة : حالة السائق"
              clearable
              clear-icon="tabler-x"
              item-value="key"
              item-title="title"
              v-model="status"
              :items="statusList"
              title="title"
            />
          </VCol>
          <VCol cols="6" md="2">
            <div class="min-w-[200px]">
              <div class="flex justify-center items-center">
                <label class="mx-5">من</label>
                <AppDateTimePicker v-model="startDate" />
              </div>
            </div>
          </VCol>
          <VCol cols="6" md="2">
            <div class="min-w-[200px]">
              <div class="flex justify-center items-center">
                <label class="mx-5">إلى</label>
                <AppDateTimePicker v-model="endDate" />
              </div>
            </div>
          </VCol>

          <VCol cols="12" md="4">
            <div class="flex justify-end flex-row px-5">
              <VBtn variant="text" @click="reset">
                <VIcon class="mx-5 text-green-500 cursor-pointer">
                  tabler:rotate-clockwise
                </VIcon>
              </VBtn>
            </div>
          </VCol>
        </VRow>
        <div class="my-2">
          <VTable class="text-no-wrap invoice-list-table">
            <!-- 👉 Table head -->
            <thead>
              <tr>
                <th v-for="item in headers" :key="item" scope="col">
                  {{ item }}
                </th>
              </tr>
            </thead>

            <!-- 👉 Table Body -->
            <tbody>
              <tr v-for="(item, index) in paginateDrivers" :key="index">
                <td>
                  <img
                    class="object-cover rounded-full w-8 h-8 my-2"
                    :src="
                      item.imageUrl === null
                        ? '/src/assets/images/avatars/avatar-1.png'
                        : getFileUrl(item.imageUrl)
                    "
                    alt=""
                  />
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.phoneNumber }}</td>
                <td>
                  <VChip
                    v-if="item.driverStatus === 'Available'"
                    variant="tonal"
                    color="primary"
                  >
                    متاح
                  </VChip>
                  <VChip v-else variant="tonal" color="error"> مشغول </VChip>
                </td>
                <td>{{ item.ordersCount }}</td>
                <td>{{ item.dateCreated.split("T")[0] }}</td>
                <td>{{ item.address }}</td>
                <td>
                  <RouterLink :to="`drivers/${item.id}`">
                    <VIcon class="cursor-pointer text-2xl"> tabler:dots-vertical </VIcon>
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </VTable>
        </div>
      </div>
      <div class="mt-10">
        <VPagination
          v-model="pagination.pageIndex"
          :length="PagCount"
          rounded="circle"
          @change="selected = false"
        />
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
