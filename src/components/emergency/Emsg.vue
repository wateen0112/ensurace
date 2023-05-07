<script setup lang="ts">
import { useEStore } from '@/stores/EStore';
import { useNotificationStore } from '@/stores/Notification';
import Bell from '@/assets/images/svg/bell.svg'
const store = useEStore();
const nStore = useNotificationStore();

const {dialog,emr,reply,notificationId} = storeToRefs(store);

const handel = ()=>{
  reply.value.id=emr.value.id;
  nStore.ReadNoti(notificationId.value);
  reply.value.reply =emr.value.reply;
  reply.value.replayType =emr.value.replayType;
  store.handel().then(()=>{
    nStore.ReadNoti(notificationId.value).then(() => {
          nStore.NotificationsUnRead = nStore.NotificationsUnRead.filter(
              (ele) => ele.id != notificationId.value
            );
          });
    dialog.value=false;
    store.getAll()
;
  });
}

const closeDialog= ()=>{
  dialog.value = false ;

}

</script>
<template>
  <VCard>
    <VCardText class="mb-10">
    <VRow>

<VCol cols="12" md="8"></VCol>

  
<div class="flex justify-start items-center">
  <img :src="Bell"   class="w-[60px] mb-8"  />

  <p class=" mx-5 text-[24px]"> 
    
           
  <strong class="text-error">رسالة تنبيه !!</strong>
تم التأخر عن تسليم الطلب.. تأخر السائق بطريقه 
</p>
  

</div>
    </VRow>
    <VRow>

<VCol cols="12" md="6" class="my-2">  <VTextField
  label="الزبون"
  :readonly="true"
  v-model="emr.customerName"
  >

</VTextField> </VCol>

<VCol cols="12" md="6" class="my-2">  <VTextField
  label="رقم الزبون"
  v-model="emr.customerPhoneNumber"
  :readonly="true"
  >

</VTextField> </VCol>


<VCol cols="12" md="6" class="my-2">  <VTextField
  label=" السائق"
  :readonly="true"
  v-model="emr.driver.name"
  >

</VTextField> </VCol>

<VCol cols="12" md="6" class="my-2">  <VTextField
  label="رقم السائق"
  v-model="emr.driver.phoneNumbers[0]"
  :readonly="true"
  >

</VTextField> </VCol>

<VCol cols="12" md="6" class="my-2">  <VTextField
  label="رقم الطلب"
  v-model="emr.orderNumber"
  :readonly="true"
  >

</VTextField> </VCol>


<VCol cols="12" md="6" class="my-2">  <VTextField
  label="الحالة"
  :readonly="true"
  v-model="emr.orderType"
  >

</VTextField> </VCol>




    </VRow>
    <VDivider class="my-4"></VDivider>
    <p class="text-center my-5 font-semibold">
      اختر طريقه لمعالجة رسالة التنبيه عبر الاتصال أو ارسال رسالة نصية
   
    </p>
    
 <VRadioGroup
 :disabled="emr.replyDate"
 
 v-model="emr.replayType"
 inline>

<div class=" w-full flex justify-around">

  <VRadio  value="PhoneCall"  class=" border-[1px] border-solid  px-7 py-3 rounded-full">
    <template v-slot:label>
  <VLabel class="mx-5 text-current">  الاتصال بالزبون</VLabel><VBtn color="primary" icon="mdi-call">  </VBtn>
    </template>
  </VRadio>
  <VRadio   value="Sms" class=" px-7 py-3    border-[1px] border-solid rounded-full">
    <template v-slot:label>
  <VLabel class="mx-5"> إرسال رسالة</VLabel><VBtn color="primary" icon="mdi-message">  </VBtn>
    </template>
  </VRadio>
</div>
 </VRadioGroup>
<div class="my-5" v-if="emr.replayType==='Sms'">
  <VLabel class="my-2 text-xl">الرسالة</VLabel>
  <VTextarea v-model="emr.reply"></VTextarea>
</div>
    </VCardText>
    <div class="sticky bottom-4">
      <VBtn class="ml-3 mx-8" @click="handel">معالجة</VBtn>
      <VBtn variant="tonal" color="error" @click="closeDialog()">تجاهل</VBtn>
      
      </div>
    </VCard>

</template>
