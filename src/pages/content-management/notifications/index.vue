<script lang="ts" setup>
import AddNotification from '@/components/notifications/AddNotification.vue';
import Page from '@/components/shared/Page.vue';
import { useAppStore } from '@/stores/App';
import { useNotificationStore } from '@/stores/Notification';
import { usePagination } from '@/composables/usePagination';
import { useRouter } from 'vue-router';

const router = useRouter();
const { pagination, paginate } = usePagination();
const Store = useNotificationStore();
const { searchVal } = storeToRefs(Store);
const Notificationlist = computed(() => Store.Notificationlist);
const NotReceive = computed(() => Store.NotReceive);
const paginationList = computed(() => paginate(Notificationlist.value));
const paginations = computed(() => paginate(NotReceive.value));
const tab = ref(0);
const selectSingalList = ref<string[]>([]);
const selectList = ref<Array<string>>([]);
const isMulti = ref();
const ids = ref<Array<string>>([]);

Store.GetAllNotification();

const onLoad = () => {
  useAppStore().SetPageMeta({
    breadCrumb: [],
    icon: 'tabler-bell',
    title: 'الاشعارات',
  });
};

onLoad();

function goToPage(target: any) {
  if (target.notificationDashType === 'NewContactUs')
    router.push(`${`/${target.onClick}`}`);
}

// Delete By Id
function deleteById() {
  Store.DeleteNotification(selectList.value);
}

function selectAll() {
  Notificationlist.value?.forEach((element: any) => {
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
  ids.value = rows.map(ele => ele.id);
}
watch(selectList.value, () => {
  if (selectList.value.length > 0)
isMulti.value = true;
  else isMulti.value = false;
});

const notificationPage = ref<InstanceType<typeof Page> | null>(null);

function closDialog() {
  notificationPage.value?.closeDialog();
}
</script>

<template>
  <Page
    ref="notificationPage"
    v-model:search="searchVal"
    :add="tab === 0"
    dialog-title="إضافة اشعار"
    button-text="اشعار جديد"
    icon="tabler-bell"
    placeholder="ابحث عن اشعار محدد"
  >
    <template #dialog-form>
      <AddNotification @formSubmit="closDialog" />
    </template>
    <VTabs id="VTab" v-model="tab">
      <div>
        <VTab> المرسلة </VTab>
        <VTab> الورادة </VTab>
      </div>
    </VTabs>

    <VWindow v-model="tab">
      <VWindowItem>
        <div class="w-[100%] flex justify-between items-center mx-2">
          <span id="check" class="flex items-center">
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
            تحديد الكل
          </span>

          <div class="text-left">
            <VBtn color="error" icon="mdi-trash" variant="plain" @click="deleteById" />
          </div>
        </div>
        <VExpansionPanels v-for="item in paginationList" :key="item.id">
          <VExpansionPanel class="mt-1">
            <VExpansionPanelTitle>
              <div
                class="flex lg:flex-row lg:justify-between flex-col gap-5 text items-center w-full"
              >
                <div class="flex justify-center items-center">
                  <VCheckbox
                    v-model="selectSingalList"
                    color="primary"
                    :value="item.id"
                    hide-details
                    @select="removeItem"
                    @change="selectAllSingal(item.id)"
                  />
                  {{ item.title }}
                </div>
                <div>
                  <div v-if="item.isSendToAll === false">
                    المرسل اليه:

                    <VChip variant="tonal" color="primary">
                      {{ item.sendToNames.join("-") }}
                    </VChip>
                  </div>
                  <div v-else>
                    المرسل اليه:

                    <VChip variant="tonal" color="error">
                      جميع المشتركين
                    </VChip>
                  </div>
                </div>
                <div>
                  {{ new Date(item.dateCreated).toLocaleDateString() }}
                </div>
              </div>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div class="relative right-3">
                {{ item.body }}
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
        <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
          <!-- 👉 Pagination meta -->
          <span class="text-sm text-disabled" />

          <!-- 👉 Pagination -->

          <VPagination
            v-model="pagination.pageIndex"
            class="pb-5 pt-3"
            :length="pagination.totalPages"
          />
        </div>
      </VWindowItem>
      <VWindowItem>
        <div class="w-[100%] flex justify-between items-center mx-2">
          <span id="check" class="flex items-center">
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
            تحديد الكل
          </span>

          <div class="text-left">
            <VBtn color="error" icon="mdi-trash" variant="plain" @click="deleteById" />
          </div>
        </div>
        <VCard v-for="item in paginations" :key="item.id" class="p-5 mt-1">
          <div
            class="flex flex-row justify-between items-center w-[100%]"
            @click="goToPage(item)"
          >
            <div class="flex justify-center items-center">
              <VCheckbox
                v-model="selectSingalList"
                color="primary"
                :value="item.id"
                hide-details
                @select="removeItem"
                @change="selectAllSingal(item.id)"
              />
              {{ item.title }}
            </div>
            <div>
              <VBadge v-if="item.isNew === false" dot color="error" inline />
              <!-- <VBadge v-else dot color="success" inline /> -->
              {{ new Date(item.dateCreated).toLocaleDateString() }}
            </div>
          </div>
        </VCard>
        <div class="d-flex align-center flex-wrap justify-center gap-4 py-3">
          <!-- 👉 Pagination meta -->
          <span class="text-sm text-disabled" />

          <!-- 👉 Pagination -->

          <VPagination
            rounded="circle"
            v-model="pagination.pageIndex"
            class="pb-5 pt-3"
            :length="pagination.totalPages"
          />
        </div>
      </VWindowItem>
    </VWindow>
  </Page>
</template>

<style scoped>
#VTab {
  width: 315px !important;
  margin: 0 auto;
  display: flex;
  position: relative;
  transition: 0.2s all cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: nowrap;
}
.v-expansion-panel-title {
  padding: 20px;
}
</style>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'OrderHandler' ]
  </route>
