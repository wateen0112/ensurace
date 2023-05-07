<script lang="ts" setup>
import { useShopStore } from "@/stores/Shop";
import { useSettingStore } from "@/stores/Setting";
import { storeToRefs } from "pinia";
import { useFile } from "@/composables/index";
import { TaxValueType } from "@/enums/Tax";
import WorkTimeInput from "@/components/shared/WorkTimeInput.vue";
import Branches from "@/components/shops/shopDetails/branches.vue";
import Orders from "@/components/orders/OrdersTable.vue";
import Categories from "@/components/products/CategoryList.vue";
import { usePagination } from "@/composables/usePagination";
import { useAppStore } from "@/stores/App";
import { useBranchCategoriesStore } from "@/stores/BranchesCategories";
import { useRouter } from "vue-router";
import { requiredValidator, lengthValidator } from "@validators";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper";
import { AddShopWithBranch } from "@/api/Shop/dto";
import { useSubStore } from "@/stores/Subsecrption";
import LangSwitcher from "@/components/shared/LangSwitcher.vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import "./style.css";
import { VListItem } from "vuetify/components";
const route = useRoute();
const props = defineProps({
  id: String,
});
console.log(route.name);

const router = useRouter();
const urlImageDel = ref<Array<string>>([]);
const storeCategory = useBranchCategoriesStore();
const { pagination, paginate } = usePagination();
const { getFileUrl, openFileWindow } = useFile();
const onboarding = ref("");
const taxOptions = ref([
  { title: "قيمة ثابتة", value: TaxValueType.Value },
  { title: "نسبة", value: TaxValueType.Rate },
]);
const store = useShopStore();
const { shopDetailsDto, shopNames, modifyBranchDto, addShopDto } = storeToRefs(
  useShopStore()
);
const { addBranchCategoryDto } = storeToRefs(useBranchCategoriesStore());
const { labels, citiesList, areas, shopCategories } = storeToRefs(
  useSettingStore()
);

const isDialogVisible = ref(false);
const isDelUrl = ref(false);
const isAddFile = ref(false);
const isLoading = ref(false);
const isLoadingBranch = ref(false);
const subStore = useSubStore();
const { subs } = storeToRefs(useSubStore());

subStore.getAll();

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: "mdi-store",
    title: "المتاجر",
  });

  store.GetBranchesId(props.id).then(() => {
    pagination.value.totalCount =
      shopDetailsDto.value.branch.otherBranches.length;
    addBranchCategoryDto.value.branchId = shopDetailsDto.value.branch.id;
  });
};

onLoad();

function delBranch() {
  store.DeleteBranch([props.id], "mainBranch").then(() => router.go(-1));
}

const paginationSwiper = ref({
  clickable: true,
  renderBullet(index: number, className: string) {
    return `<span class="${className}">${index + 1}</span>`;
  },
  modules: [Pagination],
});

function getFiles(payload: { file: File | any; base64: string }) {
  shopDetailsDto.value.branch.image.defaultUrl = URL.createObjectURL(
    payload.file
  );

  modifyBranchDto.value.image.defaultFile = payload.file;
}

function deleteOtherUrl(i: number) {
  console.log(i);
  isDelUrl.value = true;
  urlImageDel.value.push(shopDetailsDto.value.branch.image.othersUrls[i]);

  shopDetailsDto.value.branch.image.othersUrls =
    shopDetailsDto.value.branch.image.othersUrls.filter(
      (ele, indx) => indx !== i
    );
  modifyBranchDto.value.image.otherFiles.pop();
  console.log(shopDetailsDto.value.branch.image.othersUrls.length);
}
function AddFile(payload: { file: File | any }) {
  isAddFile.value = true;
  modifyBranchDto.value.image.otherFiles.push(payload.file);
  shopDetailsDto.value.branch.image.othersUrls.push(
    URL.createObjectURL(payload.file)
  );
}

// function getEvaluation() {
//   router.push({
//     path: "/content-management/ratings",
//     query: {
//       name: shopDetailsDto.value.branch.name,
//     },
//   });
// }
function editShop() {
  isLoading.value = true;

  store
    .ModifyShop({
      id: shopDetailsDto.value.branch.shopId,
      name: shopDetailsDto.value.branch.shopName,
      categoryId: shopDetailsDto.value.branch.categoryId,
    })
    .then(() => {
      isLoading.value = false;
      isDialogVisible.value = false;
    });
}
function paginateShopOrder() {}
async function editBranch() {
  isLoadingBranch.value = true;
  try {
    await store.ModifyBranch({
      id: shopDetailsDto.value.branch.id,
      name: shopDetailsDto.value.branch.name,
      phoneNumber: shopDetailsDto.value.branch.phoneNumber,
      ownerPhoneNumber: shopDetailsDto.value.branch.ownerPhoneNumber,
      description: shopDetailsDto.value.branch.description,
      address: shopDetailsDto.value.branch.address,
      cityId: shopDetailsDto.value.branch.cityId,
      areaId: shopDetailsDto.value.branch.areaId,
      isHidden: shopDetailsDto.value.branch.isHidden,
      autoGenerateInvoice: shopDetailsDto.value.branch.autoGenerateInvoice,
      workTimes: shopDetailsDto.value.branch.workTimes,
      labelIds: shopDetailsDto.value.branch.labelsIds,
      tax: shopDetailsDto.value.branch.tax,
      image: {
        defaultFile: modifyBranchDto.value.image.defaultFile
          ? modifyBranchDto.value.image.defaultFile
          : null,
        otherFiles:
          modifyBranchDto.value.image.otherFiles && isAddFile.value === true
            ? modifyBranchDto.value.image.otherFiles
            : null,
        deleteOther: isDelUrl.value === true ? urlImageDel.value : [],
      },
    });

    isLoadingBranch.value = false;
  } catch (er) {
    isLoadingBranch.value = false;
    console.log("ERROR IN UPDATE : ", er, typeof er);
  }
}
store.GetShopNames();
onBeforeUnmount(() => {
  console.log("leave page shop");

  addShopDto.value = { ...new AddShopWithBranch() };
});
</script>

<template>
  <div class="container mx-auto">
    <div class="flex gap-3 title items-center justify-between mt-3">
      <div class="flex gap-3 title items-center lg:justify-start">
        <h3>المتاجر</h3>
        <span>|</span>
        <VIcon color="primary" icon="uil:store" />
        <span>تفاصيل الفرع</span>
      </div>

      <div class="flex justify-center gap-2">
        <VDialog v-model="isDialogVisible" max-width="600">
          <template #activator="{ props }">
            <VBtn v-bind="props"> التعديل على المتجر </VBtn>
          </template>

          <!-- Dialog close btn -->
          <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

          <!-- Dialog Content -->
          <VCard title="تعديل على متجر">
            <VCardText>
              <VRow>
                <!-- 👉 shop Name -->

                <VCol cols="12">
                  <VTextField
                    v-model="shopDetailsDto.branch.shopName"
                    label="اسم المتجر "
                  />
                </VCol>

                <!-- 👉 shop type -->
                <VCol cols="12">
                  <VSelect
                    v-model="shopDetailsDto.branch.categoryId"
                    :items="shopCategories"
                    item-value="id"
                    item-title="name"
                    label="نوع المتجر"
                  />
                </VCol>
              </VRow>
            </VCardText>

            <VCardText class="d-flex justify-end flex-wrap gap-3">
              <VBtn
                variant="tonal"
                color="secondary"
                @click="isDialogVisible = false"
              >
                Close
              </VBtn>
              <VBtn :loading="isLoading" @click="editShop"> Save </VBtn>
            </VCardText>
          </VCard>
        </VDialog>
        <VBtn :loading="isLoadingBranch" @click="editBranch"> تعديل </VBtn>
        <VBtn variant="outlined" color="error" @click="delBranch"> حذف </VBtn>
        <VBtn variant="outlined" color="success" @click="router.go(-1)">
          تراجع
        </VBtn>
      </div>
    </div>
    <VCard class="p-5 mt-3">
      <div class="flex justify-between items-center gap-3 mb-5">
        <div class="flex justify-start items-center gap-3">
          <VIcon icon="mdi-bookmark-outline" color="primary" />
          <h4>تفاصيل الفرع</h4>
          <LangSwitcher v-model="store.lang" />
        </div>
        <VBadge
          :color="shopDetailsDto.branch.isOnline ? 'success' : 'error'"
          class="absolute left-8 top-8"
        />
      </div>
      <VForm>
        <VRow>
          <VCol cols="12" md="8">
            <VRow>
              <!-- 👉 shop Name -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="shopDetailsDto.branch.shopName"
                  disabled
                  label="اسم المتجر"
                />
              </VCol>

              <!-- 👉 shop type -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="shopDetailsDto.branch.categoryId"
                  disabled
                  :items="shopCategories"
                  item-value="id"
                  item-title="name"
                  label="نوع المتجر"
                />
              </VCol>

              <!-- 👉 shop label -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="shopDetailsDto.branch.labelsIds"
                  multiple
                  label="مايقدمه المتجر"
                  :items="labels"
                  item-value="id"
                  item-title="name"
                />
              </VCol>

              <!-- 👉 branch name -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="shopDetailsDto.branch.name"
                  :rules="[requiredValidator]"
                  label="اسم الفرع"
                />
              </VCol>

              <!-- 👉 phone number  -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="shopDetailsDto.branch.phoneNumber"
                  :rules="[
                    requiredValidator,
                    lengthValidator(shopDetailsDto.branch.phoneNumber, 10),
                  ]"
                  label="رقم التواصل"
                />
              </VCol>
              <!-- 👉 owner phone number -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="shopDetailsDto.branch.ownerPhoneNumber"
                  :rules="[
                    requiredValidator,
                    lengthValidator(shopDetailsDto.branch.ownerPhoneNumber, 10),
                  ]"
                  label="رقم صاحب المطعم"
                />
              </VCol>
              <!-- 👉 opion -->
              <VCol cols="12" md="6" class="relative">
                <VTextField
                  v-model="shopDetailsDto.branch.evaluation"
                  label="تقييم الاراء"
                  disabled
                  :rules="[requiredValidator]"
                />
                <!--
                    <VBtn
                                      class="absolute top-5 left-5"
                                      icon
                                      variant="text"
                                      color="default"
                                      size="x-small"
                                    >
                                      <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
                                    </VBtn> 
                    -->
              </VCol>

              <!-- 👉 countury -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="shopDetailsDto.branch.cityId"
                  :items="citiesList"
                  item-value="id"
                  item-title="name"
                  label="المحافظة"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <!-- 👉 address -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="shopDetailsDto.branch.address"
                  label="العنوان"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 dateCreate -->
              <VCol cols="12" md="6">
                <AppDateTimePicker
                  v-model="shopDetailsDto.branch.dateCreated"
                  label="تاريخ الانشاء"
                  disabled
                />
              </VCol>

              <!-- 👉 area -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="shopDetailsDto.branch.subscriptionId"
                  label="نوع الاشتراك"
                  :items="subs"
                  item-title="name"
                  item-value="id"
                  disabled
                />
              </VCol>
              <VCol cols="12" md="6">
                <VSelect
                  v-model="shopDetailsDto.branch.areaId"
                  :items="areas"
                  item-value="id"
                  item-title="name"
                  label="المنطقة"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Company -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="shopDetailsDto.branch.tax.value"
                  label="الضريبة"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VSelect
                  v-model="shopDetailsDto.branch.tax.valueType"
                  item-title="title"
                  item-value="value"
                  :items="taxOptions"
                />
              </VCol>
              <!-- 👉 account -->
              <VCol cols="12" md="6">
                <label for="الحساب">الحساب</label>
                <VRadioGroup
                  v-model="shopDetailsDto.branch.autoGenerateInvoice"
                >
                  <div class="flex gap-4 justify-start">
                    <VRadio label="فوري" :value="true" />
                    <VRadio label=" غير فوري" :value="false" />
                  </div>
                </VRadioGroup>
              </VCol>

              <!-- 👉 status shop -->
              <VCol cols="12" md="6">
                <label for="حالة المتجر">حالة المتجر</label>
                <VRadioGroup v-model="shopDetailsDto.branch.isHidden">
                  <div class="flex gap-4 justify-start">
                    <VRadio label="اظهار" :value="false" />
                    <VRadio label="اخفاء" :value="true" />
                  </div>
                </VRadioGroup>
              </VCol>

              <!-- 👉 description -->
              <VCol cols="12">
                <textarea
                  id="message"
                  v-model="shopDetailsDto.branch.description"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-500 rounded-lg border borde-gray-300 focus:border-gray-700 focus:outline-none"
                  placeholder="وصف المتجر"
                  :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" md="4">
            <span class="mx-3">الصورة الاساسية</span>

            <VCol cols="12" class="relative">
              <VMenu>
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    class="absolute top-6 left-2 ml-4"
                    icon
                    variant="flat"
                    color="primary"
                    size="x-small"
                  >
                    <VIcon icon="mdi-dots-vertical" :size="22" />
                  </VBtn>
                </template>

                <VList>
                  <VListItem @click="openFileWindow(getFiles)">
                    <VListItemTitle>تعديل صورة</VListItemTitle>
                  </VListItem>
                  <!--
                    <VListItem @click="delFileDefault">
                                        <VListItemTitle>حذف صورة</VListItemTitle>
                                      </VListItem>
                    -->
                </VList>
              </VMenu>
              <img
                class="w-full rounded h-[300px] object-cover"
                :src="getFileUrl(shopDetailsDto.branch.image.defaultUrl)"
                alt=""
                srcset=""
              />
            </VCol>
            <!-- {{ shopDetailsDto.branch.image.othersUrls }} -->
            <span class="mx-3">باقي الصور</span>
            <VCol cols="12" class="relative">
              <!-- {{ shopDetailsDto.branch.image.othersUrls }} -->
              <div
                v-if="shopDetailsDto.branch.image.othersUrls.length === 0"
                class="flex justify-center items-center w-full"
              >
                <VBtn
                  color="success"
                  @click="
                    openFileWindow((payload) => {
                      AddFile(payload);
                    })
                  "
                >
                  Add Image
                </VBtn>
              </div>

              <Swiper
                :pagination="paginationSwiper"
                :modules="paginationSwiper.modules"
                class="mySwiper"
              >
                <SwiperSlide
                  v-for="(image, i) in shopDetailsDto.branch.image.othersUrls"
                  :key="i"
                >
                  <!-- {{ i }} -->
                  <VMenu class="absolute z-30">
                    <template #activator="{ props }">
                      <VBtn
                        v-bind="props"
                        class="absolute top-4 left-3"
                        icon
                        variant="flat"
                        color="primary"
                        size="x-small"
                      >
                        <VIcon
                          icon="mdi-dots-vertical"
                          :size="22"
                          color="white"
                        />
                      </VBtn>
                    </template>

                    <VList>
                      <VListItem
                        @click="
                          openFileWindow((payload) => {
                            AddFile(payload);
                          })
                        "
                      >
                        <VListItemTitle>اضافة صورة</VListItemTitle>
                      </VListItem>
                      <VListItem @click="deleteOtherUrl(i)">
                        <VListItemTitle>حذف صورة</VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                  <img
                    :src="getFileUrl(image)"
                    class="w-full rounded"
                    style="height: 300px !important"
                    alt=""
                    srcset=""
                  />
                </SwiperSlide>
              </Swiper>
            </VCol>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
    <VRow>
      <!-- 👉 Date Time -->
      <VCol cols="12" md="6">
        <VCard class="p-5 mt-5">
          <WorkTimeInput v-model="shopDetailsDto.branch.workTimes" />
        </VCard>
      </VCol>
      <!-- 👉 Branches -->
      <VCol cols="12" md="6">
        <Branches />
      </VCol>
    </VRow>
    <!-- 👉 Categories and Products -->
    <Categories
      :is-order="false"
      :hide-menu="false"
      :branch-id="shopDetailsDto.branch.id"
      :category-list="shopDetailsDto.branch.categories"
    />
    <!-- 👉 orders -->
    <Orders
      class="mt-10"
      :orders="shopDetailsDto.orderPagination.orders"
      @paginate="store.GetBranchesId(props.id)"
      @search="store.GetBranchesId(props.id)"
      @filter="store.GetBranchesId(props.id)"
    />
  </div>
</template>

<style>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination-bullet {
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
  opacity: 1;
  background: rgba(0, 0, 0, 0.2);
}

.swiper-pagination-bullet-active {
  color: #fff;
  background: #f8ad24;
}
</style>

<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry' , 'OrderHandler']
</route>
