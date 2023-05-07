<script lang="ts" setup>
import { useSubStore } from "@/stores/Subsecrption";
import Page from "@/components/shared/Page.vue";
import { useAppStore } from "@/stores/App";
import AddShop from "@/components/subscriptions/AddShop.vue";
import { VForm } from "vuetify/components";
import { requiredValidator, integerValidator } from "@/@core/utils/validators";
const page = ref();

const store = useSubStore();
const props = defineProps(["id"]);
const isLoading = ref(false);

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "tabler:brand-shopee",
    title: "الاشتراكات",
  });
};
const { sub, brachPageCount, branchesPaginations, pagination } = storeToRefs(store);
const headers = [
  "اسم المتجر",
  "بداية الاشتراك",
  "نهاية الاشتراك",
  "نسبة الاشتراك",
  "سعر الاشتراك",
  "تفاصيل المتجر ",
];
const refForm = ref<InstanceType<typeof VForm>>();
onBeforeMount(() => {
  store.getById(props.id);
});
const errors = ref<Record<string, string>>({
  name: "",
  pricentage: "",
  price: "",
  period: "",
});

const submit = () => {
  refForm.value?.validate().then((res) => {
    if (res.valid) {
      isLoading.value = true;
      store.modify().then(() => {
        isLoading.value = false;
      });
    }
  });
};

const deleteShops = (id: string) => {
  store.deleteSub(id).then(() => {
    idsToBeDeleted.value = [];
    selected.value = false;
  });
};
//selected methods

const selected = ref(false);
const idsToBeDeleted = ref<string[]>([]);

function addIdTobeDeleted(id: string) {
  idsToBeDeleted.value.push(id);

  selected.value = idsToBeDeleted.value.length === branchesPaginations.value.length;
}
function removeIdFromDeletingList(id: string) {
  idsToBeDeleted.value = idsToBeDeleted.value.filter((i: string) => {
    return i !== id;
  });
  selected.value = idsToBeDeleted.value.length === branchesPaginations.value.length;
}

// function checkSelectionForAll() {
//   let thereIsSelcted = false;

//   branchesPaginations.value.forEach((element: any) => {
//     if (element.selected) thereIsSelcted = true;
//   });

//   return thereIsSelcted;
// }
function handelSelectAll(ss: boolean) {
  console.log("ss value is ", ss);

  branchesPaginations.value.forEach((item: any) => {
    item.selected = ss;
    if (!idsToBeDeleted.value.includes(item.id) && item.selected)
      addIdTobeDeleted(item.id);
    else if (idsToBeDeleted.value.includes(item.id) && !item.selected)
      removeIdFromDeletingList(item.id);
  });
  selected.value = idsToBeDeleted.value.length === branchesPaginations.value.length;
}
function handleSelection() {
  sub.value.branches.forEach((item: any) => {
    Object.assign(item, { selected: false });
  });
}
function handleDeleting() {
  if (idsToBeDeleted.value.length > 0) store.deleteBranch(idsToBeDeleted.value);
}
watch(idsToBeDeleted, () => {
  selected.value =
    idsToBeDeleted.value.length === branchesPaginations.value.length &&
    idsToBeDeleted.value.length !== 0;
});
const subPage = ref();
const closeDialog = () => {
  subPage.value.closeDialog();
};
handleSelection();
onLoad();
</script>

<template>
  <Page
    dialog-title="إضافة متجر جديد"
    icon="tabler:brand-shopee"
    :add="false"
    :has-search="false"
  >
    <template #header> </template>
    <template #action-button>
      <VBtn class="mx-1" @click="submit" :loading="isLoading" variant="tonal"
        >تعديل
      </VBtn>
      <VBtn class="mx-1" @click="deleteShops(props.id)" variant="tonal" color="error"
        >حذف
      </VBtn>
      <router-link to="../subscriptions"
        ><VBtn class="mx-1" variant="outlined">تراجع </VBtn></router-link
      >
    </template>

    <VForm ref="refForm">
      <VCard class="mt-5">
        <VCardText>
          <VRow>
            <VCol cols="12" md="12">
              <h3>
                <VIcon color="primary " class="mx-3">tabler:clipboard-data</VIcon> تفاصيل
                الاشتراك
              </h3></VCol
            >

            <VCol cols="12" md="4">
              <div class="my-5">
                <VTextField label="رقم الاشتراك" :disabled="true" v-model="sub.number" />
              </div>

              <div class="mt-5">
                <VTextField
                  label="اسم الاشتراك"
                  v-model="sub.name"
                  :rules="[requiredValidator]"
                  :error-messages="errors.name"
                />
              </div>
            </VCol>
            <VCol cols="12" md="4">
              <div class="my-5">
                <VTextField
                  label="عدد المتاجر المشتركة"
                  :disabled="true"
                  v-model="sub.branchesCount"
                />
              </div>
              <div class="mt-5">
                <VTextField
                  label="مدة الاشتراك"
                  type="number"
                  v-model.number="sub.period"
                  :rules="[requiredValidator, integerValidator]"
                  :error-messages="errors.perperiod"
                  prefix="يوم"
                />
              </div>
            </VCol>
            <VCol cols="12" md="4">
              <div class="my-5">
                <VTextField
                  label="نسبة الادمن  من المتجر "
                  type="number"
                  v-model.number="sub.profitPercent"
                  :rules="[requiredValidator, integerValidator]"
                  :error-messages="errors.pricentage"
                  prefix="%"
                />
              </div>
              <div class="mt-5">
                <VTextField
                  type="number"
                  label="سعر الاشتراك"
                  v-model.number="sub.price"
                  :rules="[requiredValidator, integerValidator]"
                  :error-messages="errors.price"
                />
              </div>
            </VCol>
            <VCol cols="12" md="12">
              <div class="my-5">
                <VTextField label="ملاحظات الاشتراك" v-model="sub.note" />
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
      <VCard class="mt-5">
        <VCardText>
          <Page
            dialog-title="إضافة متجر جديد"
            icon="tabler:brand-shopee"
            button-text="متجر جديد"
            ref="subPage"
            :has-sub-title="true"
            sub-title="المتاجر المشتركة"
            :hasSearch="false"
            :add="true"
          >
            <template #action-button></template>
            <template #dialog-form>
              <AddShop :id="sub.id" @dialog="closeDialog()" />
            </template>
            <VRow>
              <VCol cols="12" md="12">
                <div class="w-full flex justify-end px-8">
                  <VBtn variant="text">
                    <VIcon
                      class="cursor-pointer text-2xl text-red-500 hover:opacity-70"
                      @click="handleDeleting"
                    >
                      tabler:trash
                    </VIcon></VBtn
                  >
                </div>
                <VTable class="text-no-wrap invoice-list-table">
                  <!-- 👉 Table head -->
                  <thead>
                    <tr>
                      <th id="check" class="text-left">
                        <VCheckbox
                          v-model="selected"
                          @change="handelSelectAll(selected)"
                        />
                      </th>

                      <th v-for="item in headers" :key="item" scope="col">
                        {{ item }}
                      </th>
                    </tr>
                  </thead>

                  <!-- 👉 Table Body -->
                  <tbody>
                    <tr v-for="(item, index) in branchesPaginations" :key="index">
                      <td>
                        <VCheckbox
                          v-model="item.selected"
                          @change="
                            !item.selected
                              ? removeIdFromDeletingList(item.id)
                              : addIdTobeDeleted(item.id)
                          "
                        />
                      </td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.startDate.split("T")[0] }}</td>
                      <td>{{ item.endDate.split("T")[0] }}</td>
                      <td>{{ item.profitPercent }}</td>
                      <td>{{ item.price }}</td>
                      <td>
                        <router-link :to="`../shops/${item.id}`"
                          ><VIcon color="primary"
                            >tabler:dots-vertical</VIcon
                          ></router-link
                        >
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCol>
              <VCol cols="12" md="12">
                <div class="mt-10">
                  <VPagination
                    v-model="pagination.pageIndex"
                    :length="brachPageCount"
                    rounded="circle"
                  />
                </div>
              </VCol>
            </VRow>
          </Page>
        </VCardText>
      </VCard>
    </VForm>
  </Page>
</template>
<style>
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
<route lang="yaml">
  meta:
  roles: ['SuperAdmin' ,'Accountant','DataEntry' ]
</route>
