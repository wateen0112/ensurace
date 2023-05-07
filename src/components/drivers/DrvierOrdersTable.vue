<script setup lang="ts">
import { useDriverStore } from '@/stores/Driver';
import { Order_Stage } from "@/enums/OrderStage";
import { useOrderStore } from '@/stores/Order';
const store = useDriverStore();
const orderStore  = useOrderStore();
const {getDriverByIdDto} = storeToRefs(store);
const  {orderStatus,orderType} = storeToRefs(orderStore)
const headers = [
  'رقم الطلب',
  'اسم الزبون ',
  'رقم الموبايل',
  'العنوان',
  'اسم المتجر ',
  ' تاريخ الطلب ',
 
  ' نوع  الطلب ',
  'حالة  الطلب ',
  'تفاصيل  ',

]
</script>
<template>

<VTable>
  <thead> <tr>
    <th class="min-w-[120px]" v-for="header in headers"> {{header}}</th>
  </tr></thead>
  <tbody>
    <tr v-for="(order , index) in getDriverByIdDto.orderPagination.orders">
      <td>{{order.number}}</td>
      <td>{{order.customerName}}</td>
      <td>{{order.phoneNumber}}</td>
      <td class="min-w-[240px]">{{order.address}}</td>
      <td class="min-w-[200px]">{{order.branchNames[0]}}</td>
      <td class="min-w-[160px]">{{order.date.split('T')[0]+','+order.date.split('T')[1].split('.')[0]}}</td>
      <td>      {{ orderType.find((ele) => ele.type == order.orderType)?.value }}</td>
      <td>    <VChip :color="   orderStatus.find((ele) => ele.status == order.progress.status)
        ?.color">
        {{
          orderStatus.find((ele) => ele.status == order.progress.status)
            ?.value
        }}

      </VChip></td>
      <td >

        <router-link :to="`/content-management/orders/stage/ConfirmOrder/${order.id}`">
          <VBtn
          icon="mdi-dots-vertical"
          size="x-small"
          scope="col"
          class="text-center"
          
        />
        </router-link>
      </td>
    </tr>
    
  </tbody>
</VTable>
<div class="mt-10">
  <VPagination
        
          rounded="circle"
       
        />
</div>

</template>
