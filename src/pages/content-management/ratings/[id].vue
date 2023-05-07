<script setup lang="ts">
import FileUploader from "@/components/shared/FileUploader.vue";
import { useRouter } from "vue-router";
import type { BranchsEvaluation } from "@/api/Rating/dto";
import { useRatingStore } from "@/stores/Rating";
import { useFile } from "@/composables/index";

const props = defineProps({
  id: String,
});
const { getFileUrl, openFileWindow } = useFile();
const store = useRatingStore();
const { ratingDetailDto, ratingDto } = storeToRefs(useRatingStore());
const router = useRouter();
const isLoading = ref(false);
const branchIds = ref<string[]>([]);
const isDialogVisible = ref(false);
const isDialogVisibleDriver = ref(false);
const selectSingalList = ref<Array<string>>([]);
const selectList = ref<Array<string>>([]);
const isMulti = ref();
const ids = ref<Array<string>>([]);
store.GetByIdRating(props.id);

// function getFiles(payload: { file: File | any }) {
//   ratingDetailDto.value.driversEvaluation.imageUrl = URL.createObjectURL(payload.file);
//   ratingDetailDto.value.driversEvaluation.imageFile = payload.file;
// }
function ModifyAddRateBranch() {
  isLoading.value = true;
  store
    .UpsertBranchEvaluation({
      id: props.id,
      value: ratingDto.value.value,
      imageFile: ratingDto.value.imageFile,
      note: ratingDto.value.note,
      branchId: ratingDto.value.branchId,
    })
    .then(() => {
      isLoading.value = false;
      ratingDto.value.value = 0;
      ratingDto.value.note = '';
      ratingDto.value.imageUrl = '';
      ratingDto.value.branchId = '';
      isDialogVisible.value = false;
    });
}
function ModifyAddRateDriver() {
  isLoading.value = true;
  store
    .UpsertDriverEvaluation({
      id: props.id,
      value: ratingDetailDto.value.driversEvaluation.value,
      imageFile: ratingDetailDto.value.driversEvaluation.imageFile,
      note: ratingDetailDto.value.driversEvaluation.note,
    })
    .then(() => {
      isLoading.value = false;
      isDialogVisibleDriver.value = false;
    });
}
function rateDetails(item: BranchsEvaluation) {
  isDialogVisible.value = true;
  ratingDto.value.value = item.value;
  ratingDto.value.note = item.note;
  ratingDto.value.imageUrl = item.imageUrl;
  ratingDto.value.branchId = item.branchId;
}
function delRateDriver() {
  store.DeleteDriver(props.id);
}
function delRateBranch() {
  ratingDetailDto.value.branchesEvaluated.forEach((el) =>
    branchIds.value.push(el.branchId)
  );
  store.DeleteBranch(props.id, branchIds.value);
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
</script>

<template>
  <div class="mt-6">
    <div class="flex gap-3 title items-center justify-between mt-3 gap-">
      <div class="flex gap-3 title items-center lg:justify-start">
        <h3>التقييمات</h3>
        <span>|</span>
        <VIcon color="primary" icon="tabler-star" />
        <span>تفاصيل التقييم</span>
      </div>

      <VBtn variant="outlined" color="primary" @click="router.go(-1)">تراجع</VBtn>
    </div>
    <!-- {{ ratingDetailDto }} -->
    <VCard title="تفاصيل التقييم" class="mt-6">
      <VCardText>
        <VRow>
          <!-- 👉 number order -->
          <VCol cols="12" md="4">
            <VTextField readonly label="رقم الطلب" v-model="ratingDetailDto.number" />
          </VCol>
          <!-- 👉 type order -->
          <VCol cols="12" md="4">
            <VTextField readonly label="نوع الطلب" v-model="ratingDetailDto.orderType" />
          </VCol>
          <!-- 👉 customer Name -->
          <VCol cols="12" md="4">
            <VTextField
              readonly
              label="اسم الزبون"
              v-model="ratingDetailDto.customerName"
            />
          </VCol>
          <!-- 👉 phoneNumber  -->
          <VCol cols="12" md="4">
            <VTextField
              readonly
              label="رقم الموبايل"
              v-model="ratingDetailDto.customerPhoneNumber"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <VCard class="mt-6">
      <VCardTitle class="flex justify-between items-center">
        <label>تفاصيل السائق</label>
        <div>
          <VDialog v-model="isDialogVisibleDriver" max-width="600">
            <template #activator="{ props }">
              <VBtn
                append-icon="mdi-pen"
                variant="outlined"
                color="success"
                class="mt-4"
                v-bind="props"
                >تعديل تقييم السائق</VBtn
              >
            </template>

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="isDialogVisibleDriver = !isDialogVisibleDriver" />

            <!-- Dialog Content -->
            <VCard title="تقييم السائق">
              <VCardText>
                <div class="flex flex-col gap-4">
                  <label>التقييم :</label>
                  <VRating v-model="ratingDetailDto.driversEvaluation.value"></VRating>
                </div>

                <div class="flex flex-col gap-4">
                  <label>التعليق :</label>
                  <textarea
                    v-model="ratingDetailDto.driversEvaluation.note"
                    id="message"
                    rows="4"
                    class="block p-2.5 w-full text-sm text-gray-500 rounded-lg border borde-gray-300 focus:border-gray-700 focus:outline-none"
                    placeholder="الوصف"
                  />
                </div>

                <div class="flex flex-col gap-4">
                  <label>الصورة :</label>

                  <FileUploader
                    v-model="ratingDetailDto.driversEvaluation.imageFile"
                    v-model:url="ratingDetailDto.driversEvaluation.imageUrl"
                  />
                </div>
              </VCardText>

              <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="isDialogVisibleDriver = false"
                >
                  Close
                </VBtn>
                <VBtn :loading="isLoading" @click="ModifyAddRateDriver"> Save </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
          <VBtn variant="outlined" color="error" class="mt-4 mx-4" @click="delRateDriver"
            >حذف تقييم السائق</VBtn
          >
        </div>
      </VCardTitle>

      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <!-- 👉 driver Name -->
            <VTextField
              readonly
              class="my-4"
              label="اسم السائق"
              v-model="ratingDetailDto.driversEvaluation.name"
            />
            <!-- 👉 phoneNumber  -->
            <VTextField
              readonly
              class="my-4"
              label="رقم السائق"
              v-model="ratingDetailDto.driversEvaluation.phoneNumber"
            />
            <!-- 👉 rating -->
            <div class="flex flex-col my-4">
              <label>تقييم السائق</label>
              <VRating
                readonly
                v-model="ratingDetailDto.driversEvaluation.value"
              ></VRating>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <!-- 👉 comment -->
            <VCol cols="12">
              <textarea
                readonly
                id="message"
                rows="4"
                class="block p-2.5 w-full text-sm text-gray-500 rounded-lg border borde-gray-300 focus:border-gray-700 focus:outline-none"
                placeholder="التعليق"
                v-model="ratingDetailDto.driversEvaluation.note"
              />
            </VCol>
          </VCol>
          <VCol cols="12" md="4">
            <VCol cols="12" class="relative">
              <!-- <VMenu>
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    class="absolute top-5 left-5"
                    icon
                    color="primary"
                    size="x-small"
                  >
                    <VIcon icon="mdi-dots-vertical" :size="22" color="white" />
                  </VBtn>
                </template>

                <VList>
                  <VListItem @click="openFileWindow(getFiles)">
                    <VListItemTitle>تعديل صورة</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu> -->
              <!-- https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9k1fj_8Kv9yd5AHlKkDcXfKtrMgdOJp_0Jw&usqp=CAU -->
              <img
                class="w-full rounded h-[300px] object-cover"
                :src="
                  ratingDetailDto.driversEvaluation.imageUrl
                    ? getFileUrl(ratingDetailDto.driversEvaluation.imageUrl)
                    : ''
                "
                alt=""
                srcset=""
              />
            </VCol>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <VCard class="mt-6">
      <div class="flex justify-between items-center mx-4 mt-3">
        <h4>المتاجر الذي تم تقييمها</h4>
        <div>
          <VBtn color="success" variant="outlined" @click="isDialogVisible = true"
            >اضافة متجر لتقييمه</VBtn
          >
        </div>

        <VDialog v-model="isDialogVisible" max-width="600">
          <!-- Dialog close btn -->
          <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

          <!-- Dialog Content -->
          <VCard title="تقييم متجر">
            <VCardText>
              <div class="flex flex-col gap-4">
                <label>التقييم :</label>
                <VRating v-model="ratingDto.value"></VRating>
              </div>
              <div class=" my-4">
              <div 
              v-if=" ratingDetailDto.branchesEvaluated.map((el)=>el.isEvaluated).join('') =='false'"
               class="flex flex-col gap-4">
                <label>اسم المتجر :</label>
                <!-- {{ BranchNameList }} -->
                <VSelect
                  label="اسم المتجر"
                  :items="ratingDetailDto.branchesEvaluated"
                  v-model="ratingDto.branchId"
                  item-title="name"
                  item-value="branchId"
                />
              </div>
              <div v-else>
              <h3> لا يوجد متاجر للتقييم </h3>
               </div>
              </div>
              <div class="flex flex-col gap-4">
                <label>التعليق :</label>
                <textarea
                  v-model="ratingDto.note"
                  id="message"
                  rows="4"
                  class="block p-2.5 w-full text-sm text-gray-500 rounded-lg border borde-gray-300 focus:border-gray-700 focus:outline-none"
                  placeholder="الوصف"
                />
              </div>

              <div class="flex flex-col gap-4">
                <label>الصورة :</label>

                <FileUploader
                  v-model="ratingDto.imageFile"
                  v-model:url="ratingDto.imageUrl"
                />
              </div>
            </VCardText>

            <VCardText class="d-flex justify-end flex-wrap gap-3">
              <VBtn variant="tonal" color="secondary" @click="isDialogVisible = false">
                Close
              </VBtn>
              <VBtn :loading="isLoading" @click="ModifyAddRateBranch"> Save </VBtn>
            </VCardText>
          </VCard>
        </VDialog>
      </div>
      <VTable class="text-no-wrap invoice-list-table px-5 pt-2">
        <!-- 👉 Table head -->
        <thead>
          <tr>
            <th scope="col">
              <VBtn
                icon
                variant="text"
                color="default"
                size="x-small"
                @click="delRateBranch"
              >
                <VIcon icon="mdi-trash-can-outline" :size="22" />
              </VBtn>
            </th>
            <th scope="col">الصورة</th>
            <th scope="col">اسم المتجر</th>
            <th scope="col">تصنيف المتجر- اسم فرع</th>
            <th scope="col">تقييم</th>
            <th scope="col">ملاحظة</th>
            <th scope="col">تفاصيل</th>
          </tr>
        </thead>

        <!-- 👉 Table Body -->
        <tbody>
          <tr v-for="rate in ratingDetailDto.branchesEvaluated" :key="rate.branchId">
            <th>
            <VCheckbox
                v-model="selectSingalList"
                color="primary"
                :value="rate.branchId"
                hide-details
                @select="removeItem"
                @change="selectAllSingal(rate.branchId)"
              /></th>
            <!-- 👉 image url -->
            <th>
              <img
                height="35"
                width="35"
                class="rounded-full"
                :src="getFileUrl(rate.imageUrl != null ? rate.imageUrl : '')"
              />
            </th>
            <!-- 👉 store name -->
            <th>{{ rate.name }}</th>
            <!-- 👉 shop / branch -->
            <th>{{ rate.category }}</th>
            <!-- 👉 evalution -->
            <th>
              <VRating v-model="rate.value"></VRating>
              <!-- {{ rate.value }} -->
            </th>
            <!-- 👉 note -->
            <th>{{ rate.note }}</th>

            <td style="width: 7.5rem">
              <VBtn
                icon
                variant="text"
                color="default"
                size="x-small"
                @click="rateDetails(rate)"
              >
                <VIcon icon="mdi-dots-vertical" :size="22" color="primary" />
              </VBtn>
            </td>
          </tr>
        </tbody>

        <!-- 👉 table footer  -->
        <!-- 
        <tfoot v-if="ratingDetailDto.branchsEvaluation.length != 0">
          <tr>
            <td colspan="8" class="text-center text-body-1">لايوجد بيانات</td>
          </tr>
        </tfoot> -->
      </VTable>
    </VCard>
  </div>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'OrderHandler' ]
  </route>
