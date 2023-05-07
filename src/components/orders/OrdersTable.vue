<script lang="ts" setup>
import AppDateTimePicker from "@core/components/AppDateTimePicker.vue";
import type { OrderItem } from "@/api/Order/dto";
import { Order_Stage } from "@/enums/OrderStage";
import Swal from "sweetalert2";
import { useOrderStore } from "@/stores/Order";

const props = defineProps({
  orders: Array as () => OrderItem[],
  total: Number,
});

const Store = useOrderStore();

const emit = defineEmits(["filter", "paginate", "search"]);

const {
  isDialogUnconifermOrder,
  handleOrderDto,
  orderStatus,
  orderType,
  endDate,
  startDate,
  searchOrder,
  fiterOrder,
} = storeToRefs(useOrderStore());

const orderPerson = ref(false);
function changeVal() {
  Store.GetAllOrder(fiterOrder.value);
}

const ids = ref<Array<string>>([]);
const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();
const { filterDto, orderStatusOptions, pagination, orderFilterParams } =
  storeToRefs(orderStore);

function emitEvent() {
  console.log(route.name);
  if (orderFilterParams) emit("filter", orderFilterParams);
  if (searchOrder) emit("search", searchOrder);
  if (pagination) emit("paginate", pagination);
  if (route.name === "content-management-orders") {
    console.log(route.name);
    orderStore.GetAllOrder(fiterOrder.value);
  }
}

function deleteOrders() {
  orderStore.DeleteOrder(ids.value);
}

function navigateToOrder(order: OrderItem) {
  console.log(order.progress.stage);
  if (order.progress.stage === Order_Stage.Confirmed) {
    router.push({
      path: `/content-management/orders/stage/ConfirmOrder/${order.id}`,
      query: {
        isConfirmedOrder: 1,
        tellBranches: 0,
        receivedFromBranches: 0,
        isConfirmedDriver: 0,
        receivedToCustomer: 0,
        rollBack: 0,
        stage: order.progress.stage,
      },
    });
  } else if (order.progress.stage === Order_Stage.ConfirmedBranches) {
    router.push({
      path: `/content-management/orders/stage/ConfirmDriver/${order.id}`,
      query: {
        isConfirmedOrder: 1,
        tellBranches: 0,
        receivedFromBranches: 0,
        isConfirmedDriver: 0,
        receivedToCustomer: 0,
        rollBack: 0,
        stage: order.progress.stage,
      },
    });
  } else if (
    order.progress.status === Order_Stage.UnConfirmed &&
    order.progress.stage === "NewOrder"
  ) {
    console.log("in stage confirme");

    Swal.fire({
      text: "هل تريد معالجة الطلب؟! ",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "عدم معالجة الطلب",
      confirmButtonText: "معالجة الطلب",
    }).then((result) => {
      if (result.isConfirmed) {
        orderStore.HandlerOrder(order.id).then((res) => {
          if (res?.status === 200) {
            router.push({
              path: `/content-management/orders/stage/ConfirmOrder/${order.id}`,
              query: {
                stage: order.progress.stage,
                isConfirmedOrder: 0,
                tellBranches: 0,
                isConfirmedDriver: 0,
                receivedFromBranches: 0,
                receivedToCustomer: 0,
                rollBack: 0,
              },
            });
            orderStore.GetConfirmedOrderById(order.id);
          }

          // handleOrderDto.value = res?.data;
        });

        // .catch((res) => {
        //   console.log('in catch");

        //   handleOrderDto.value = res?.data;

        //   Swal.fire({
        //     text: `انت غير مخول للوصول لهذا الطلب وبسبب ان هناك موظف آخر يقوم بمعالجة هذا الطلب من قبل ${handleOrderDto.value.employeeName} في تاريخ ${handleOrderDto.value.dateTime}`,
        //   });
        // });
      }
    });
  } else if (order.progress.stage === Order_Stage.ConfirmedDriver) {
    router.push({
      path: `/content-management/orders/stage/OrderDetails/${order.id}`,
      query: {
        stage: order.progress.stage,
        isConfirmedOrder: 1,
        tellBranches: 1,
        isConfirmedDriver: 1,
        receivedFromBranches: 0,
        receivedToCustomer: 0,
        rollBack: 0,
      },
    });
  } else if (order.progress.stage === Order_Stage.ReceivedFromBranches) {
    router.push({
      path: `/content-management/orders/stage/OrderDetails/${order.id}`,
      query: {
        stage: order.progress.stage,
        isConfirmedOrder: 1,
        tellBranches: 1,
        isConfirmedDriver: 1,
        receivedFromBranches: 1,
        receivedToCustomer: 0,
        rollBack: 0,
      },
    });
  } else if (order.progress.stage === Order_Stage.ReceivedToCustomer) {
    router.push({
      path: `/content-management/orders/stage/OrderDetails/${order.id}`,
      query: {
        stage: order.progress.stage,
        isConfirmedOrder: 1,
        tellBranches: 1,
        isConfirmedDriver: 1,
        receivedFromBranches: 1,
        receivedToCustomer: 1,
        rollBack: 0,
      },
    });
  } else if (order.progress.stage === Order_Stage.RollBac) {
    router.push({
      path: `/content-management/orders/stage/OrderDetails/${order.id}`,
      query: {
        stage: order.progress.stage,
        isConfirmedOrder: 1,
        tellBranches: 1,
        isConfirmedDriver: 1,
        receivedFromBranches: 1,
        receivedToCustomer: 1,
        rollBack: 1,
      },
    });
  }
}
const statusOrder = [
  {
    key: "InProcess",
    title: "قيد الانتظار",
  },
  {
    key: "UnConfirmed",
    title: "غير مؤكد",
  },
  {
    key: "Confirmed",
    title: " مؤكد",
  },
  {
    key: "OnWay",
    title: " في الطريق",
  },
  {
    key: "Done",
    title: " تم التسليم",
  },
  {
    key: "Cansel",
    title: " ملغي",
  },
  {
    key: "RollBack",
    title: " مرتجع",
  },
];

// watch(
//   pagination,
//   () => {
//     emit("paginate");
//   },
//   { deep: true }
// );

// watch(
//   orderFilterParams,
//   () => {
//     emit("filter");
//   },
//   { deep: true }
// );

// watch(
//   searchOrder,
//   () => {
//     emit("search");
//   },
//   { deep: true }
// );
function resetFilters  (){
  startDate.value = '';
  endDate.value='';
  searchOrder.value='';
  fiterOrder.value='';
  changeVal();
  
}
</script>

<template>
  <div>
    <div>
      <div class="grid grid-cols-12 align-center gap-x-2">
        <div class="col-span-2">
          <VSelect
            v-model="fiterOrder"
            label="فلترة :  حالة الطلب"
            :value="fiterOrder"
            :items="statusOrder"
            item-value="key"
            clear-icon="tabler-x"
            item-title="title"
            @update:model-value="changeVal"
          />
        </div>
        <div class="col-span-2">
          <div class="flex justify-center items-center">
            <label class="mx-1">من</label>
            <AppDateTimePicker v-model="startDate" />
          </div>
        </div>
        <div class="col-span-2">
          <div class="flex justify-center items-center">
            <label class="mx-1">إلى</label>
            <AppDateTimePicker v-model="endDate" />
          </div>
        </div>
        <div class="col-span-4">
          <div class="flex justify-center items-center">
            <VTextField
              v-model="searchOrder"
              append-inner-icon="mdi-search"
              label="ابحث عن زبون معين"
              @update:model-value="changeVal"
            />
          </div>
        </div>
        <div class="col-span-2">
          <VBtn block append-icon="mdi-filter" @click="emitEvent"> فلترة </VBtn>
        </div>
      </div>
    </div>

    <div class="my-2">
      <div class="flex justify-end items-end w-full">
        <VBtn
        icon
        variant="text"
        color="default"
        size="x-small"
        @click="resetFilters"
      >
                  <VIcon icon="tabler:rotate-clockwise" :size="26" color="success"  />
      </VBtn>
        <VBtn
          icon
          variant="text"
          color="default"
          size="x-small"
          @click="deleteOrders"
        >
          <VIcon icon="mdi-trash" :size="26" color="error" />
        </VBtn>
     
      </div>
      <VTable density="comfortable" class="text-no-wrap invoice-list-table">
        <!-- 👉 Table head -->
        <thead>
          <tr>
            <th id="check" class="text-left"></th>
            <th scope="col" class="text-center">رقم الطلب</th>
            <th scope="col" class="text-center">اسم الزبون</th>
            <th scope="col" class="text-center">رقم الموبايل</th>
            <th scope="col" class="text-center">العنوان</th>
            <th scope="col" class="text-center">اسم المتجر</th>
            <th scope="col" class="text-center">تاريخ الطلب</th>
            <th scope="col" class="text-center">اسم السائق</th>
            <th scope="col" class="text-center">نوع الطلب</th>
            <th scope="col" class="text-center">حالة الطلب</th>
            <th scope="col" class="text-center">تفاصيل</th>
          </tr>
        </thead>
        <!-- 👉 Table Body -->
        <tr v-for="order in orders" :key="order.id" class="h-16">
          <td>
            <!-- @change="selectItems(order.id)" -->
            <VCheckbox
              class="mx-5"
              color="primary"
              :value="order.id"
              v-model="ids"
              hide-details
            />
          </td>
          <td class="text-center">
            {{ order.number }}
          </td>
          <td class="text-center">
            {{ order.customerName }}
          </td>
          <td class="text-center">
            {{ order.phoneNumber }}
          </td>
          <td class="text-center">
            {{ order.address.split("-").slice(0, 2).join("/") }}
          </td>
          <td class="text-center">
            <ul
              class="flex rounded flex-col my-4"
              :class="{ border: order.branchNames.length > 1 }"
            >
              <li v-for="shop in order.branchNames" :key="shop" class="p-1">
                {{ shop }}
              </li>
            </ul>
          </td>
          <td class="text-center">
            {{ new Date(order.date).toLocaleString() }}
          </td>
          <td class="text-center">
            {{ order.driverName }}
          </td>
          <td class="text-center">
            {{ orderType.find((ele) => ele.type === order.orderType)?.value }}
          </td>
          <td class="text-center">
            {{
              orderStatus.find((ele) => ele.status === order.progress.status)
                ?.value
            }}
          </td>
          <td class="text-center">
            <VBtn
              icon="mdi-dots-vertical"
              size="x-small"
              scope="col"
              class="text-center"
              @click="navigateToOrder(order)"
            />
          </td>
        </tr>
        <tbody />
      </VTable>

      <VPagination
        rounded="circle"
        class="mt-4"
        v-model="pagination.pageIndex"
        :length="pagination.totalPages"
        @update:model-value="emitEvent"
      />
    </div>
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
