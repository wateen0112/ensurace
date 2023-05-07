<script lang="ts" setup>
import OrderStepper from '@/components/orders/OrderStepper.vue';
import OrderCustomerInfo from '@/components/orders/OrderCustomerInfo.vue';
import OrderInvoice from '@/components/orders/OrderInvoice.vue';
import { useOrderStore } from '@/stores/Order';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast()
const route = useRoute();
const orderStore = useOrderStore();
const isLoading = ref(false);
const router = useRouter();
const interval = ref()

interface Timer {
  hours: number
  minute: number
  second: number
  name: string
}

const expectedReceiveDates = ref<Timer[]>([])


function confDriver() {
  isLoading.value = true;
  orderStore
    .ConfirmDtiver()
    .then(() => (isLoading.value = false))
    .catch(() => (isLoading.value = false));
}

function setTimers() {
  expectedReceiveDates.value = []

  orderStore.expectedReceiveDates.forEach(b => {

    const milliseconds = (+new Date(b.date) - +new Date())
    if (milliseconds <= 0) {
      clearInterval(interval.value)
      if (orderStore.orderId)
        toast.warning(`${b.branchName} لقد انتهى الوقت المتوقع للاسلام من المتجر`, { timeout: 0 })

      expectedReceiveDates.value.push({
        hours: 0,
        minute: 0,
        second: 0,
        name: b.branchName,
      })

    }

    else {
      expectedReceiveDates.value.push({
        hours: Math.floor((milliseconds / 1000 / 60 / 60) % 24),
        minute: Math.floor((milliseconds / 1000 / 60) % 60),
        second: Math.floor((milliseconds / 1000) % 60),
        name: b.branchName,
      })

    }
  })
}

orderStore.GetConfirmDriver().then(() => {
  setTimers()
});

onMounted(() => {
  interval.value = setInterval(() => {
    setTimers()
  }
    , 1000)
})

// console.log(orderStore.expectedReceiveDates)
// setTimers()
</script>

<template>
  <div>
    <div class="grid gap-4 grid-cols-12">
      <div class="col-span-9">
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-3">
            <OrderStepper />
          </div>
          <div class="col-span-9 mt-2">
            <OrderCustomerInfo />

            <VRadioGroup v-model="orderStore.selectedDriver">
              <VTable class="text-no-wrap mt-4 invoice-list-table">
                <!-- 👉 Table head -->
                <thead>
                  <tr>
                    <th id="check" class="text-left">
                      اختيار سائق
                    </th>
                    <th scope="col">
                      اسم السائق
                    </th>
                    <th scope="col">
                      رقم الموبايل
                    </th>
                    <th scope="col">
                      حالة السائق
                    </th>
                    <th scope="col">
                      الطلبات الحالية
                    </th>
                    <th scope="col">
                      تفاصيل
                    </th>
                  </tr>
                </thead>

                <!-- 👉 Table Body -->
                <tbody>
                  <tr v-for="item in orderStore.driversList" :key="item.id">
                    <td id="check">
                      <VRadio :value="item.id" color="primary" />
                    </td>
                    <td>
                      {{ item.name }}
                    </td>
                    <td>
                      <VMenu v-if="item.phoneNumbers.length" open-on-hover>
                        <template #activator="{ props }">
                          <span v-bind="props">{{ item.phoneNumbers[0] }}</span>
                        </template>
                        <VList>
                          <VListItem v-for="(number, index) in item.phoneNumbers" :key="number" variant="text"
                            :value="index">
                            <VListItemTitle>
                              {{ number }}
                            </VListItemTitle>
                          </VListItem>
                        </VList>
                      </VMenu>
                    </td>
                    <td>متاح</td>
                    <td>
                      <VMenu v-if="item.details.length" open-on-hover>
                        <template #activator="{ props }">
                          <span v-bind="props">{{ item.details[0] }}</span>
                        </template>
                        <VList>
                          <VListItem v-for="(task, index) in item.details" :key="task" variant="text" :value="index">
                            <VListItemTitle>
                              {{ task }}
                            </VListItemTitle>
                          </VListItem>
                        </VList>
                      </VMenu>
                      <span v-else>لايوجد مهام حالية</span>
                    </td>
                    <td>
                      <VBtn class="p-1" variant="tonal" size="md" icon="mdi-dots-vertical" @click="
                        router.push(`/content-management/drivers/${item.id}`)
                      " />
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VRadioGroup>
          </div>
        </div>
      </div>
      <div class="col-span-3">
        <VCard class="mt-2">
          <OrderInvoice />
          <!-- <div class="flex justify-between items-center"> -->
          <div class="py-4 px-2 flex justify-end items-end">
            <!-- {{ orderStore.isPrior }} -->
            <VChip color="success">
              {{ orderStore.isPrior ? "الطلب مسبق" : "الطلب فوري" }}
            </VChip>
          </div>

          <!-- </div> -->
          <div>
            <VList>
              <VListItem v-for="(item, i) in expectedReceiveDates" :key="i">
                <VListItemTitle>
                  الوقت المتوقع للاستلام من
                  <span class="text-main">
                    {{ item.name }}
                  </span>
                </VListItemTitle>
                <VListItemSubtitle class="font-bold">
                  <span class="text-main">
                    {{ `${item.hours} ساعة ` + `${item.minute} دقيقة ` + `${item.second} ثانية ` }}

                  </span>
                </VListItemSubtitle>
              </VListItem>
            </VList>

            <VBtn variant="tonal" block :loading="isLoading" @click="confDriver">
              اعلام السائق
            </VBtn>
            <div class="flex justify-end items-center w-full my-4">
              <VBtn color="error" variant="outlined" class="mx-4" @click="orderStore.DeleteOrder([route.params.id])">
                حذف طلب
              </VBtn>
              <VBtn class="ml-4" variant="outlined" @click="router.go(-1)">
                رجوع
              </VBtn>
            </div>
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
