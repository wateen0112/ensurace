<script setup lang="ts">
import type { CustomerSearchDTO } from '@/api/Customer/dto';
import { CustomerSearch } from '@/api/Customer/dto';
import CustomerAutoComplete from '@/components/customers/CustomerAutoComplete.vue';
import Page from '@/components/shared/Page.vue';
import { useAppStore } from '@/stores/App';
import { useApi } from '@/composables';
import { CustomerApi } from '@/api/Customer/endpoints';
import { useSettingStore } from '@/stores/Setting';
import { useOrderStore } from '@/stores/Order';
import AddressCustomer from '@/components/shared/AddressCustomer.vue';
import { Order_Stage } from '@/enums/OrderStage';
import AddCustomer from '@/components/customers/AddCustomer.vue';

const page = ref<InstanceType<typeof Page> | null>(null);
const settinPg = useSettingStore();
const orderStore = useOrderStore();
const customerId = ref('');
const { GET } = useApi();
const customerData = computed(() => orderStore.customerData);

function closeForm() {
  page.value?.closeDialog();
}
const cityName = computed(
  () =>
    settinPg.citiesList.find(c => c.id === customerData?.value?.cityId)?.name,
);

onMounted(() => {
  useAppStore().SetPageMeta({
    title: 'اختيار زبون',
    breadCrumb: [],
    icon: 'mdi-account',
  });
});

watch(customerId, async newVal => {
  if (newVal) {
    const { data } = await GET<CustomerSearchDTO>(
      CustomerApi.SearchResult,
      { id: newVal },
      { error: true },
    );

    orderStore.$patch({ customerData: data });
    orderStore.selectedAddress = data.addresses[0].id;


  }
});

// onBeforeUnmount(() => {
//   orderStore.$patch({
//     customerData: new CustomerSearch(),
//   });
// });

onMounted(() => {
  orderStore.$patch({
    customerData: {
      addresses: [],
      cityId: '',
      id: '',
      name: '',
      orders: [],
      phoneNumber: '',
      orderNumber: 0,
      address: '',
    },
  });
});
</script>

<template>
  <Page ref="page" button-text="إضافة زبون" dialog-title="إضافة زبون جديد">
    <template #actions>
      <CustomerAutoComplete v-model="customerId" />
    </template>
    <template #dialog-form>
      <AddCustomer @formSubmit="closeForm" />
    </template>
    <template v-if="customerData?.id">
      <VCard class="px-4 py-2 grid grid-cols-2">
        <div>
          <VCardTitle class="px-0">
            <VIcon color="primary">
              mdi-account-circle-outline
            </VIcon>
            معلومات حساب الزبون
          </VCardTitle>
          <!-- {{ customerData }} -->
          <div class="flex flex-col space-y-4 my-4">
            <div class="flex items-center gap-x-4">
              <span class="font-bold"> الأسم : </span>
              <span class="text-lg"> {{ customerData?.name }} </span>
            </div>
            <div class="flex items-center gap-x-4">
              <span class="font-bold"> رقم الهاتف : </span>
              <span class="text-lg"> {{ customerData.phoneNumber }} </span>
            </div>
            <div class="flex items-center gap-x-4">
              <span class="font-bold"> المحافظة : </span>
              <span class="text-lg"> {{ cityName }} </span>
            </div>
          </div>
        </div>

        <div>
          <VCardTitle class="px-0 flex justify-between">
            <span>
              <VIcon color="primary"> mdi-map </VIcon>
              عناوين الزبون
            </span>

            <div>
              <AddressCustomer class="lg:mt-0" />
            </div>
          </VCardTitle>
          <div>
            <!-- {{ orderStore.addresses }} -->
            <VRadioGroup v-model="orderStore.selectedAddress" class="items-start justify-start flex">
              <div v-for="address in orderStore.addresses" :key="address.id" prepend-icon="mdi-map-marker"
                class="flex items-center gap-2" :value="address">
                <VRadio :value="address.id" />
                <span>
                  {{ address.text }}
                </span>
              </div>
            </VRadioGroup>
          </div>
        </div>
      </VCard>

      <VCard class="mt-4 p-2">
        <VCardTitle>
          <VIcon color="primary">
            mdi-cart-arrow-down
          </VIcon>
          اخر طلبات الزبون
        </VCardTitle>
        <VTable>
          <thead>
            <tr>
              <th>تاريخ الطلب</th>
              <th>المتاجر</th>
              <th>حالة الطلب</th>
              <th>السعر</th>
              <th>اسم السائق</th>
              <th>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in customerData.orders" :key="item.id">
              <td>{{ new Date(item.dateCreated).toLocaleString() }}</td>
              <td>{{ item.branchesNames.join(" - ") }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.driverName }}</td>
              <td>
                <VBtn variant="text" size="large" icon="mdi-dots-vertical" />
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </template>
    <template v-else>
      <div class="flex flex-col items-center mt-12">
        <img class="h-96 my-12" src="/images/placeholders/search.svg">
        <h2 class="text-gray-400">
          يرجى البحث عن زبون لعرض معلوماته
        </h2>
      </div>
    </template>
    <VBtn v-if="customerData?.id" variant="outlined" append-icon="mdi-arrow-left" class="w-[150px] mt-4" :to="{
      path: `/content-management/orders/stage/ConfirmOrder/0`,
      query: {
        stage: Order_Stage.NewOrder,
        cityId: customerData.addresses.find(a => a.id === orderStore.selectedAddress)?.cityId,
        customerId: customerData.id,
        isConfirmedOrder: 2,
      },
    }">
      متابعة
    </VBtn>
  </Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'OrderHandler' ]
  </route>
