<script lang="ts" setup>
import OrderStepper from '@/components/orders/OrderStepper.vue';
import OrderProductsCart from '@/components/orders/OrderProductsCart.vue';
import OrderInvoice from '@/components/orders/OrderInvoice.vue';
import { useOrderStore } from '@/stores/Order';
import { Order_Stage } from '@/enums/OrderStage';

// import { ConfirmReceiveBranchesDto, CompleteOrderDto } from "@/api/Order/dto";
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import FileUploader from '@/components/shared/FileUploader.vue';
import { useToast } from 'vue-toastification';

const interval = ref();
const orderStore = useOrderStore();
const {
  orderDetailDto,
  orderInvoice,
  invoiceDto,
  shopTab,
  orderShopsList,
} = storeToRefs(orderStore);
const route = useRoute();
const toast = useToast();
const router = useRouter();
const isLoading = ref(false);
const loadingCustomer = ref(false);
const isDialogVisibleRollBack = ref(false);
const isDialogVisibleCancel = ref(false);
const reason = ref('');
const isLoadingBill = ref(false);
const receiveDate = computed(
  () => orderShopsList.value.find(b => b.id === shopTab.value)?.receiveDate,
);
const timerToRecive = ref({
  s: 0,
  m: 0,
  h: 0,
});

const setTimer = () => {
  const milliseconds
    = +new Date(orderDetailDto.value.expectedReceiveCustomerDate) - +new Date();

  if (milliseconds <= 0) {
    clearInterval(interval.value);
    if (orderStore.orderId)
      toast.warning('تم تجاوز الوقت المتوقع لتسليم الزبون');
  }
  else {
    timerToRecive.value.h = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
    timerToRecive.value.m = Math.floor((milliseconds / 1000 / 60) % 60);
    timerToRecive.value.s = Math.floor((milliseconds / 1000) % 60);
  }
};

function ConfirmBranch() {
  isLoading.value = true;
  orderStore
    .ConfirmReceiveBranch()
    .then(() => {
      isLoading.value = false;
      orderStore.GetConfirmReceiveCustomer();
    })
    .catch(() => (isLoading.value = false));
}
function rollBackOrder() {
  orderStore.RoleBackOrder(reason.value).then((res: any) => {
    if (res.status === 200)
      isDialogVisibleRollBack.value = false;
  });
}
function canOrder() {
  orderStore.CancelOrder(reason.value);
}
function changeFileInvoice() {
  isLoadingBill.value = true;
  orderStore
    .UploadBill(invoiceDto.value.invoiceFile)
    .then(() => (isLoadingBill.value = false))
    .catch(() => (isLoadingBill.value = false));
}

function evaluationDetails() {
  router.push(`/content-management/ratings/${orderDetailDto.value.id}`);
}
function confirmCustomer() {
  loadingCustomer.value = false;
  orderStore
    .ConfirmReceiveCustomer()
    .then(() => {
      loadingCustomer.value = false;
      orderStore.GetCompleteOrder();
    })
    .catch(() => (loadingCustomer.value = false));
}

if (route.query.stage === 'ReceivedToCustomer') {
  console.log('GetConfirmReceiveCustomer');
  orderStore.GetCompleteOrder().then(() => {
    interval.value = setInterval(setTimer, 1000);
  });
}
else if (route.query.stage === 'ConfirmedDriver') {
  console.log('GetConfirmDriver');
  orderStore.GetConfirmReceiveBranches().then(() => {
    interval.value = setInterval(setTimer, 1000);
  });
}
else if (route.query.stage === 'ReceivedFromBranches') {
  console.log('GetConfirmReceiveBranches');
  orderStore.GetConfirmReceiveCustomer().then(() => {
    interval.value = setInterval(setTimer, 1000);
  });
}
else if (route.query.stage === 'RollBack') {
  console.log('GetConfirmReceiveBranches');
  orderStore.GetUnCompleteOrder().then(() => {
    interval.value = setInterval(setTimer, 1000);
  });
}
</script>

<template>
  <div>
    <div class="grid gap-4 grid-cols-12">
      <div class="col-span-8">
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-3">
            <OrderStepper />
          </div>
          <div class="col-span-9 mt-2">
            <VCard class="p-6">
              <!-- {{ orderDto }} -->
              <div class="flex justify-between items-center">
                <VCardTitle primary-title>
                  <span>تفاصيل الطلب</span>
                </VCardTitle>
                <span class="">رقم الطلب: {{ orderDetailDto.number }} </span>
              </div>
              <VRow class="mt-4">
                <VCol cols="12" md="12">
                  <VTextField v-model="orderDetailDto.customerName" readonly label="اسم الزبون" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="orderDetailDto.phoneNumber" readonly label="رقم الموبايل" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="orderDetailDto.userHandlerName" readonly label="موظف معالج الطلب" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="orderDetailDto.driverName" readonly label="اسم السائق" />
                </VCol>

                <!--
                                                                               <VCol cols="12" md="6" class="mt-4">
                                                                                                <AppDateTimePicker
                                                                                                  :config="{
                                                                                                    enableTime: true,
                                                                                                    noCalendar: true,
                                                                                                    dateFormat: 'H:i',
                                                                                                  }"
                                                                                              /></VCol> 
                                                                              -->
                <VCol cols="12" md="6">
                  <VTextField v-model="orderInvoice.deliveryCoast" readonly label="تكلفة التوصيل" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="orderDetailDto.offer" label="حسم" readonly />
                </VCol>
                <VCol cols="12">
                  <VTextField v-model="orderDetailDto.address" readonly label=" العنوان " />
                </VCol>
                <VCol v-if="orderDetailDto.note" cols="12">
                  <VTextarea v-model="orderDetailDto.note" readonly label=" الملاحظة " />
                </VCol>
                <VCol v-if="orderDetailDto.reason" cols="12">
                  <VTextarea v-model="orderDetailDto.reason" readonly label="سبب الارجاع" />
                </VCol>
                <VCol v-if="route.query.stage !== 'RollBack'" cols="12" md="6" class="mt-4">
                  <label for="نوع الطلب">نوع الطلب</label>
                  <VRadioGroup v-model="orderDetailDto.isPrior" readonly>
                    <div class="flex gap-4 justify-start">
                      <VRadio label="فوري" :value="false" />
                      <VRadio label="مسبق" :value="true" />
                    </div>
                  </VRadioGroup>

                  <span v-if="orderDetailDto.priorDate" class="my-1">
                    مسبق لتاريخ
                    {{ orderDetailDto.priorDate }}
                  </span>
                </VCol>
                <VCol cols="12" md="6" class="mt-4">
                  <p class="m-0">
                    الوقت المتبقي للاستلام الزبون:
                  </p>

                  <strong>
                    <span class="text-main">
                    {{ timerToRecive.h }}
                    ساعات
                  </span>
                  <span class="text-main">
                    {{ timerToRecive.m }}
                    دقائق
                  </span>
                </strong>
              </VCol>

                <VCol cols="12">
                  <h3 v-if="
                    orderDetailDto.branches.filter((b) => b.note.length)
                      .length
                  ">
                    ملاحظات المتاجر
                  </h3>
                  <VList>
                    <VListItem v-for="item in orderDetailDto.branches.filter(
                      (b) => b.note.length,
                    )" :key="item.id">
                      <VListItemTitle>
                        <VIcon color="primary">
                          mdi-pen
                        </VIcon>
                        {{ item.note }}
                      </VListItemTitle>

                      <VListItemSubtitle>
                        {{ item.name }}
                      </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </VCol>
              </VRow>
              <div class="flex justify-between items-center mt-8">
                <div>
                  <VBtn v-if="
                    route.query.receivedFromBranches === '1'
                    && route.query.receivedToCustomer === '0'
                  " color="primary" variant="flat" :loading="loadingCustomer" @click="confirmCustomer">
                    تسليم الزبون يدويا
                  </VBtn>

                  <VDialog v-model="isDialogVisibleCancel" max-width="600">
                    <template #activator="{ props }">
                      <VBtn v-if="route.query.stage === Order_Stage.ConfirmedDriver" v-bind="props" color="error"
                        variant="outlined" class="mx-4">
                        الغاء طلب
                      </VBtn>
                    </template>

                    <!-- Dialog close btn -->
                    <DialogCloseBtn @click="isDialogVisibleCancel = !isDialogVisibleCancel" />

                    <!-- Dialog Content -->
                    <VCard title="سبب الغاء الطلب">
                      <VCardText>
                        <VRow>
                          <VCol cols="12">
                            <label for="order">السبب</label>
                          </VCol>
                          <VCol cols="12">
                            <VTextField v-model="reason" />
                          </VCol>
                        </VRow>
                      </VCardText>

                      <VCardText class="d-flex justify-end flex-wrap gap-3">
                        <VBtn variant="tonal" color="secondary" @click="isDialogVisibleCancel = false">
                          Close
                        </VBtn>
                        <VBtn :loading="isLoading" @click="canOrder">
                          Save
                        </VBtn>
                      </VCardText>
                    </VCard>
                  </VDialog>
                </div>

                <div>
                  <VDialog v-model="isDialogVisibleRollBack" max-width="600">
                    <template #activator="{ props }">
                      <VBtn v-if="
                        route.query.receivedFromBranches === '1'
                        && route.query.receivedToCustomer === '0'
                      " v-bind="props" color="error" variant="outlined" class="mx-4">
                        ارجاع الطلب
                      </VBtn>
                    </template>

                    <!-- Dialog close btn -->
                    <DialogCloseBtn @click="
                      isDialogVisibleRollBack = !isDialogVisibleRollBack
                    " />

                    <!-- Dialog Content -->
                    <VCard title="سبب ارجاع الطلب">
                      <VCardText>
                        <VRow>
                          <VCol cols="12">
                            <label for="order">السبب</label>
                          </VCol>
                          <VCol cols="12">
                            <VTextField v-model="reason" />
                          </VCol>
                        </VRow>
                      </VCardText>

                      <VCardText class="d-flex justify-end flex-wrap gap-3">
                        <VBtn variant="tonal" color="secondary" @click="isDialogVisibleRollBack = false">
                          Close
                        </VBtn>
                        <VBtn :loading="isLoading" @click="rollBackOrder">
                          Save
                        </VBtn>
                      </VCardText>
                    </VCard>
                  </VDialog>
                </div>
              </div>
            </VCard>
            <!--
                                                                               <VCard
                                                                                            class="p-6 mt-4"
                                                                                            v-if="
                                                                                              route.query.receivedToCustomer === '1' &&
                                                                                              orderDetailDto.branchesEvaluation?.length == 0
                                                                                            "
                                                                                          >
                                                                                            <h2 class="text-error">لايوجد تقييمات لهذا الطلب</h2>
                                                                                          </VCard> 
                                                                              -->
            <VCard v-if="
              route.query.receivedToCustomer === '1'
              && route.query.rollBack === '0'
            " class="p-6 mt-4">
              <div class="flex justify-between items-center">
                <span>تقييم الطلب</span>
                <VBtn variant="outlined" @click="evaluationDetails">
                  عرض تفاصيل التقييمات
                </VBtn>
              </div>
              <VRow v-if="
                orderDetailDto.branchesEvaluation
                && orderDetailDto.branchesEvaluation.length > 0
              " class="mt-5">
                <VCol cols="12" md="6" class="flex justify-start items-start flex-col">
                  <label>تقييم السائق </label>
                  <VRating v-model="orderDetailDto.driverEvaluation" />
                </VCol>
                <VCol v-for="branchEvaluation in orderDetailDto.branchesEvaluation" :key="branchEvaluation.name" cols="12"
                  md="6" class="flex justify-start items-start flex-col">
                  <label>تقييم المطعم {{ branchEvaluation.name }} </label>
                  <VRating v-model="branchEvaluation.value" />
                </VCol>
              </VRow>
              <VRow v-else class="mt-4">
                <VCol cols="12" class="flex justify-center items-center w-full">
                  <h3>لايوجد تقييمات لهذا الطلب</h3>
                </VCol>
              </VRow>
            </VCard>
          </div>
        </div>
      </div>
      <div class="col-span-4">
        <VCard class="mt-2">
          <OrderProductsCart />
          <div v-if="route.query.receivedFromBranches === '1'" class="px-4 py-5">
            <label>فاتورة المتجر</label>
            <!-- {{ invoiceDto.invoiceUrl }} -->
            <FileUploader v-model="invoiceDto.invoiceFile" v-model:url="invoiceDto.invoiceUrl" class="mt-3" />
            <VBtn v-if="route.query.receivedFromBranches === '1'" color="primary" block variant="flat" class="mt-4"
              :loading="isLoadingBill" @click="changeFileInvoice">
              رفع الملف
            </VBtn>
          </div>
          <OrderInvoice />

          <div v-if="
            route.query.isConfirmedDriver === '1'
            && route.query.receivedFromBranches === '0'
          " class="my-5 p-3">
            <VBtn :disabled="!!receiveDate" block variant="flat" :loading="isLoading" @click="ConfirmBranch">
              {{
                receiveDate
                ? `تم الاستلام في ${new Date(receiveDate,
                ).toLocaleTimeString()}`
                : "الاستلام من المتجر"
              }}
            </VBtn>
          </div>
          <div class="my-6 flex justify-end items-center w-full">
            <VBtn class="ml-4" color="primary" variant="outlined" @click="router.go(-1)">
              رجوع
            </VBtn>
            <VBtn v-if="
              (route.query.receivedFromBranches === '0'
                && route.query.receivedToCustomer === '0')
              || (route.query.receivedFromBranches === '1'
                && route.query.receivedToCustomer === '0')
            " class="ml-4" color="error" variant="outlined" @click="orderStore.DeleteOrder([route.params.id])">
              حذف الطلب
            </VBtn>
          </div>
        </VCard>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  roles: [SuperAdmin, OrderHandler]
</route>
