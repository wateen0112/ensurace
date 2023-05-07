<script setup lang="ts">

import { useEStore } from "@/stores/EStore";
const store = useEStore();
const { paginateEmrs,pagination ,PagCount,startDate,endDate} = storeToRefs(store);
const headers = [
  "رقم رسالة التنبيه",
  "تاريخ الرسالة",
  "المتجر",
  "اسم الزبون",
  "رقمه",
  "رقم الطلب  ",
  "عنوان الطلب",
  "حالة الرد",
  "طريقة الرد",
  "تفاصيل",
];
function resetFilters  (){
  startDate.value = '';
  endDate.value = '';
}
watch(startDate,()=>{
  store.getAll()
})
watch(endDate,()=>{
  store.getAll()
})
</script>
<template>
  <div>
    <div class="grid grid-cols- lg:grid-cols-2 gap-5 my-2 px-4">
   
     <div class="flex  items-center gap-2">
       
      <VTitle>الفلترة</VTitle>
      <AppDateTimePicker  v-model="startDate" label="من" />
      <AppDateTimePicker  v-model="endDate" label="إلى" />
     
  
    
    
    
     </div>
      
   <div class="flex justify-end">
    <VBtn
    icon
    variant="text"
    color="default"
    size="x-small"
    @click="resetFilters"
  >
              <VIcon icon="tabler:rotate-clockwise" :size="26" color="success"  />
  </VBtn>
   </div>
    </div>
    <VTable>
      <thead>
        <th
          :class="index === 6 || index === 2 ? 'min-w-[240px] p-5' : 'p-5'"
          v-for="(item, index) in headers"
        >
          {{ item }}
        </th>
      </thead>
      <tbody>
        <tr v-for="item in paginateEmrs">
          <td>{{ item.number }}</td>
          <td>{{ item.dateCreated.split("T")[0] }}</td>
          <td>{{ item.branchesNames[0] }}</td>
          <td>{{ item.customerName }}</td>
          <td>{{ item.phoneNumber }}</td>
          <td>{{ item.orderNumber }}</td>
          <td class="min-w-[240px]">{{ item.address }}</td>
          <td>
            <VChip color="success" v-if="item.isReplied">تم الرد</VChip>
            <VChip color="error" v-else>لم يتم الرد</VChip>
          </td>
          <td>
            <VIcon v-if="item.replayType === 'PhoneCall'" color="success">mdi-call</VIcon>
            <VIcon v-if="item.replayType === null" color="error"> mdi-close</VIcon>
            <VIcon v-if="item.replayType === 'Sms'" color="info"> mdi-message</VIcon>
          </td>
          <td>
            <router-link :to="`emergency/${item.id}`"
              ><VIcon>tabler:dots-vertical</VIcon></router-link
            >
          </td>
        </tr>
      </tbody>
    </VTable>
    <VPagination
    v-model="pagination.pageIndex"
    class="pb-5 pt-3"
    :length="PagCount"
  />
  </div>
</template>
<style>
td,
th {
  min-width: 120px;
}
</style>
