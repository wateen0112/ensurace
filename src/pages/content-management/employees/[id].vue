<script lang="ts" setup>
import Page from '@/components/shared/Page.vue';
import { useFile } from '@/composables';
import { useEmployeeStore } from '@/stores/Employee';
import { useSettingStore } from '@/stores/Setting';
import { useUserStore } from '@/stores/User';
import { useRouter } from 'vue-router';
import Order from '@/components/orders/OrdersTable.vue';

const props = defineProps({
  id: String,
});

const isDelUrl = ref(false);
const urlImageDel = ref<Array<string>>([]);

const { getFileUrl, openFileWindow } = useFile();

const router = useRouter();

const { employeeDetailsDto, orderEmployee } = storeToRefs(useEmployeeStore());

const settingStore = useSettingStore();

const userStore = useUserStore();

const store = useEmployeeStore();

store.GetDetailsEmployee(props.id);

function getFiles(payload: { file: File | any; base64: string }) {
  employeeDetailsDto.value.imageUrl = URL.createObjectURL(payload.file);
  employeeDetailsDto.value.imageFile = payload.file;
}

function addPhone(items: any) {
  items.push('');
}
function deletePhone(item: any, id: any) {
  if (item.length > 1) {
    const s = item.findIndex((ele: any, index: any) => index === id);

    item = item.splice(s, 1);
  }
}
function modifyEmp() {
  employeeDetailsDto.value.docsUrlToDelete = urlImageDel;
  store
    .ModifyEmployee({ ...employeeDetailsDto.value, id: props.id as string })
    .then(() => router.go(-1));
}

function deleteEmp() {
  if (props && props.id) 
store.DeleteEmployee([props.id]).then(() => router.go(-1));
}

function blockEmp() {
  if (!employeeDetailsDto.value.isBlock) 
userStore.BlockUser(props.id);
  else userStore.UnBlockUser(props.id);
}

function AddFile(payload: { file: File | any }) {
  employeeDetailsDto.value.docsFile = payload.file;
  employeeDetailsDto.value.docsUrl.push(URL.createObjectURL(payload.file));
}

function deleteOtherUrl(item: string) {
  isDelUrl.value = true;
  employeeDetailsDto.value.docsUrl = employeeDetailsDto.value.docsUrl.filter(
    el => el !== item,
  );
  urlImageDel.value.push(item);
}
</script>

<template>
  <Page :add="false" :has-search="false">
    <template #action-button>
      <div class="flex justify-center items-center gap-3">
        <VBtn variant="tonal" color="primary" @click="modifyEmp">
تعديل
</VBtn>
        <VBtn variant="outlined" color="error" @click="deleteEmp">
حذف
</VBtn>
        <VBtn variant="tonal" color="error" @click="blockEmp">
          {{ employeeDetailsDto.isBlock ? " فك الحظر" : "حظر" }}
        </VBtn>
        <VBtn variant="outlined" color="success" @click="router.go(-1)">
تراجع
</VBtn>
      </div>
    </template>
    <div class="costumer-details flex">
      <VCol cols="12" md="8">
        <Vcard
          class="grid lg:grid-cols-2 grid-cols-12 lg:col-span-2 col-span-12 gap-5 p-5 shadow-lg border rounded"
        >
          <div class="lg:col-span-1 col-span-12">
            <div class="md:col-span-4 col-span-12">
              <VTextField v-model="employeeDetailsDto.name" label="اسم الموظف" />
            </div>
            <div class="md:col-span-4 col-span-12 mt-2">
              <VSelect
                v-model="employeeDetailsDto.role"
                item-value="name"
                item-title="name"
                :items="store.roleList"
                label="الصلاحيات"
              />
            </div>
            <div class="md:col-span-4 col-span-12 mt-2">
              <AppDateTimePicker
                v-model="employeeDetailsDto.birthDate"
                label="تاريخ الميلاد "
              />
            </div>
            <div class="md:col-span-4 col-span-12 mt-2">
              <VTextField v-model="employeeDetailsDto.address" label="العنوان" />
            </div>
            <div class="md:col-span-4 col-span-12 mt-2">
              <div class="position-relative">
                <VBtn
                  size="x-small"
                  icon
                  style="left: 0"
                  class="position-absolute bg-primary"
                  @click="addPhone(employeeDetailsDto.phoneNumbers)"
                >
                  <VIcon style="color: #eee">
mdi-plus
</VIcon>
                </VBtn>
                <div v-for="(itemPhone, i) in employeeDetailsDto.phoneNumbers" :key="i">
                  <VBtn
                    v-if="employeeDetailsDto.phoneNumbers.length > 1"
                    size="x-small"
                    icon
                    style="top: 0; left: 2rem"
                    class="delete position-absolute"
                    @click="deletePhone(employeeDetailsDto.phoneNumbers, i)"
                  >
                    <VIcon style="color: #eee">
mdi-trash
</VIcon>
                  </VBtn>
                </div>
                <div v-for="(itemPhone, i) in employeeDetailsDto.phoneNumbers" :key="i">
                  <div class="mt-2">
                    <label class="mx-2" for="رقم الموبايل"
                      >رقم الموبايل {{ i + 1 }}</label
                    >
                    <VTextField
                      v-model="employeeDetailsDto.phoneNumbers[i]"
                      label="رقم الموبايل"
                      name="رقم الموبايل"
                      placeholder="رقم الموبايل"
                      class="mt-3"
                      size="large"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:col-span-1 col-span-12">
            <div class="md:col-span-4 col-span-12">
              <VTextField v-model="employeeDetailsDto.userName" label="اسم المستخدم" />
            </div>
            <div class="md:col-span-4 col-span-12 mt-2">
              <VSelect
                v-model="employeeDetailsDto.cityId"
                item-value="id"
                item-title="name"
                :items="settingStore.citiesList"
                label="المحافظة"
              />
            </div>
            <div class="md:col-span-4 col-span-12 mt-2">
              <VTextField v-model="employeeDetailsDto.email" label="البريد الإلكتروني" />
            </div>
            <div class="md:col-span-4 col-span-12 mt-2">
              <VTextField v-model="employeeDetailsDto.password" label=" كلمة السر" />
            </div>
          </div>
        </Vcard>
      </VCol>
      <VCol cols="12" md="4">
        <div
          class="grid lg:col-span-1 col-span-12 gap-5 p-3 shadow-lg border rounded p-5 rounded shadow-lg border"
        >
          <div class="col-span-12">
            <label class="text-sm p-2">صورة الموظف</label>
            <div cols="12" class="relative">
              <VMenu>
                <template #activator="{ props }">
                  <VBtn
                    v-bind="props"
                    class="absolute top-4 left-3"
                    icon
                    variant="flat"
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
              </VMenu>
              <img
                v-if="employeeDetailsDto.imageUrl"
                class="w-full h-[300px] my-2"
                :src="getFileUrl(employeeDetailsDto.imageUrl)"
              >
            </div>

            <div class="md:col-span-4 col-span-12">
              <label class="text-sm p-2">وثائق الموظف</label>
              <div
                v-if="employeeDetailsDto.docsUrl.length === 0"
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
              <VCarousel
                :show-arrows="false"
                hide-delimiter-background
                delimiter-icon="mdi-circle"
                color="white"
                height="300"
              >
                <VCarouselItem v-for="(item, i) in employeeDetailsDto.docsUrl" :key="i">
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
                        <VIcon icon="mdi-dots-vertical" :size="22" color="white" />
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
                      <VListItem @click="deleteOtherUrl(item)">
                        <VListItemTitle>حذف صورة</VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                  <img
                    v-if="employeeDetailsDto.imageUrl"
                    class="w-full h-[300px] my-2"
                    :src="getFileUrl(item)"
                  >
                </VCarouselItem>
              </VCarousel>
            </div>
          </div>
        </div>
      </VCol>
    </div>
    <div class="mt-6">
        <Order :orders="orderEmployee?.orderPagination.orders" />
      </div>
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry']
  </route>
