<script lang="ts" setup>
import AddContact from "@/components/contactUs/AddContact.vue";
import Page from "@/components/shared/Page.vue";
import { useAppStore } from "@/stores/App";
import { useContactStore } from "@/stores/ContactUs";
import AppDateTimePicker from "@core/components/AppDateTimePicker.vue";

const store = useContactStore();

const contact = ref();
const { startDate, endDate, query } = storeToRefs(store);

const { paginateContacts, pagination, PagCount } = storeToRefs(store);

const reset = () => {
  store.filterReset();
};

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "tabler:message-share",
    title: "الشكاوي  و الاقتراحات",
  });
};

const selected = ref<boolean>(false);

const headers = [
  " رقم الشكوى/ الاقتراح",
  "أرسلت بتاريخ",
  "رقمه",
  "رقم الطلب التابع لها",
  "حالة الرد",
  "تفاصيل",
];

onLoad();
onBeforeMount(() => {
  store.getAllContacts();
});
</script>

<template>
  <div>
    <Page
      ref="contact"
      v-model:search.number="query"
      dialog-title="إضافة شكوى \ اقتراح جديد"
      placeholder="ابحث عن رقم  الشكوى "
      button-text="شكوى \ اقتراح جديد"
      icon="tabler-baby-carriage"
    >
      <template #dialog-form>
        <AddContact @dialog="contact.closeDialog" />
      </template>
      <div>
        <VRow>
          <VCol cols="5" md="3">
            <div class="min-w-[200px]">
              <div class="flex justify-center items-center">
                <label class="mx-5">من</label>
                <AppDateTimePicker v-model="startDate" />
              </div>
            </div>
          </VCol>
          <VCol cols="5" md="3">
            <div class="min-w-[200px]">
              <div class="flex justify-center items-center">
                <label class="mx-5">إلى</label>
                <AppDateTimePicker v-model="endDate" />
              </div>
            </div>
          </VCol>

          <VCol cols="1" md="6">
            <div class="w-full lg:flex justify-end">
              <VBtn variant="text" @click="reset">
                <VIcon class="mx-5 text-green-500 cursor-pointer">
                  tabler:rotate-clockwise
                </VIcon></VBtn
              >
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
              <tr v-for="(item, index) in paginateContacts" :key="index">
                <td>{{ item.number }}</td>
                <td>{{ item.dateCreated.split("T")[0] }}</td>
                <td>{{ item.customerName }}</td>
                <td>{{ item.orderNumber }}</td>
                <td>
                  <VChip color="primary" variant="tonal" v-if="item.isReplied === true">
                    تم الرد</VChip
                  >
                  <VChip color="error" variant="tonal" v-else>لم يتم الرد</VChip>
                </td>
                <td>
                  <router-link :to="`contactus/${item.id}`"
                    ><VIcon> tabler:dots-vertical</VIcon></router-link
                  >
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
</style>
