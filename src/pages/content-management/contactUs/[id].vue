<script setup lang="ts">
import { useFile } from '@/composables';
import { useContactStore } from '@/stores/ContactUs';
import { ReplyDto } from '@/api/ContactUs/dto';
import { useRouter } from 'vue-router';

const props = defineProps(['id']);

const router = useRouter();
const store = useContactStore();
const isloading = ref(false);
const { getFileUrl } = useFile();

const { contactDto } = storeToRefs(store);
const rep = new ReplyDto();
const replyDto = reactive(rep);

function submit() {
  replyDto.id = props.id;

  isloading.value=true
  store.replyOnContact(replyDto).then(()=>{
    isloading.value = false ;
    router.go(-1)
  })
}
onBeforeMount(() => {
  isloading.value = true;
  store.getyId(props.id).then(() => {
    isloading.value = false;
  replyDto.reply=contactDto.value.reply
  });

});
</script>

<template>
  <VForm ref="refVForm" class="mt-5">
    <VCard class="">
      <VCardText>
        <VCardTitle>
          <VIcon color="primary"> tabler-clipboard-text </VIcon> تفاصيل الشكوى
        </VCardTitle>
      </VCardText>
      <VCardText>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="col">
            <div class="">
              <VTextField
                v-model="contactDto.number"
                label="رقم الشكوى \ الاقتراح"
                readonly
              />
            </div>
            <div class="my-5">
              <VTextField
                v-model="contactDto.customerEmail"
                label="البريد الالكتروني"
                :value="
                  contactDto.customerEmail === null
                    ? 'لا يوجد '
                    : contactDto.customerEmail
                "
                readonly
              />
            </div>
            <div class="mt-5">
              <VTextField
                v-model="contactDto.customerPhoneNumber"
                label=" رقم  الموبايل"
                readonly
              />
            </div>
            <div class="my-5">
              <VTextField
                v-model="contactDto.customerName"
                label="اسم صاحب الشكوى  \ الاقتراح"
                readonly
              />
            </div>
          </div>

          <div class="col">
            <div class="">
              <VTextField
                v-model="contactDto.orderNumber"
                label=" رقم  الطلب التابع لها "
                :value="
                  contactDto.orderNumber === null ? 'لا يوجد' : contactDto.orderNumber
                "
                readonly
              />
            </div>
            <div class="mt-5">
              <VTextField v-model="contactDto.dateCreated" label=" التاريخ " readonly />
            </div>
          </div>

          <div v-if="contactDto.imageUrl" class="w-full flex justify-center col">
            <img
              class="w-full object-cover shadow-md rounded-sm"
              :src="getFileUrl(contactDto.imageUrl)"
              alt=""
            />
          </div>

          <div class="lg:col-span-3 grid lg:grid-cols-3">
            <div class="mb-5 lg:col-span-1 col-span-3">
              <VTextField
                v-model="contactDto.title"
                label="عنوان الشكوى \ الاقتراح "
                readonly
              />
            </div>
            <div class="col-span-3 lg:block hidden" />

            <div class="col-span-3">
              <VTextarea
                v-model="contactDto.content"
                label="نص الشكوى \ الاقتراح "
                readonly
              />
            </div>
          </div>
        </div>
        <div class="col mb-3 mt-5">
          <VTextarea v-model="replyDto.reply" label="الرد على الشكوى \ الاقتراح" />
        </div>
        <div  v-if="contactDto.reply" class="col mb-3 mt-5 flex gap-5">
 <img  class="w-[30px] h-[30px] rounded-full" :src="getFileUrl(contactDto.repliedDashUserImageUrl)" alt="">
          <p>
      اسم الموظف صاحب الرد {{ contactDto.repliedDashUserName }}
 

    </p>
        </div>

        <div class="w-full flex justify-start mt-5 col-span-3">
          <VBtn  type="button" :loading="isloading" :disabled="contactDto.repliedDashUserName" @click="submit"> إرسال </VBtn>
          <VBtn variant="outlined" color="primary" class="mx-5" @click="$router.go(-1)">
            رجوع
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VForm>
</template>

<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry']
  </route>
