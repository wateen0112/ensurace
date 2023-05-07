<script lang="ts" setup>
import { AddContactDto } from '@/api/ContactUs/dto';
import { useContactStore } from '@/stores/ContactUs';
import { useCustomerStore } from '@/stores/Customer';
import { useOrderStore } from '@/stores/Order';
import { VForm } from 'vuetify/components';
import { requiredValidator, integerValidator, lengthValidator } from '@validators';
import FileUploader from '../shared/FileUploader.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: () => false,
  },
});
const emit = defineEmits(['dialog']);
const tempDto = new AddContactDto();
const dto = reactive(tempDto);
const store = useContactStore();
const isloading = ref(false);
const customerStore = useCustomerStore();
const orderStore = useOrderStore();
const { orders } = storeToRefs(orderStore);
const { CustomerWithOrder, searchCustomer } = storeToRefs(customerStore);
const { error } = storeToRefs(store);
const refVForm = ref<InstanceType<typeof VForm>>();

const errors = ref<Record<string, string | undefined>>({
  customerId: undefined,

  title: undefined,
  content: undefined,
});
const submit = () => {
  refVForm.value?.validate().then(result => {
    if (result.valid) {
      store.addContact(dto).then(() => {
        if (!error.value)
          emit('dialog');
        isloading.value = false;
      });
    }
  });
};
onBeforeMount(() => {
  customerStore.GetCustomerWithOrder();
});
</script>

<template>
  <VForm ref="refVForm" class="min-h-[400px]">
    <div class="grid lg:grid-cols-2 grid-col-1 gap-5 p-2">
      <div class="col">
        <VAutocomplete
          v-model="dto.customerId"
          :items="CustomerWithOrder"
          item-title="name"
          item-value="id"
          label="  حساب الزبون "
          :rules="[requiredValidator]"
          :error-messages="errors.customerId"
        />
      </div>

      <div class="col">
        <VTextField
          v-model="dto.title"
          label=" العنوان   "
          :rules="[requiredValidator]"
          :error-messages="errors.title"
        />
      </div>

      <div class="col">
        <VAutocomplete
          v-model="dto.orderId"
          :items="CustomerWithOrder.find((el) => el.id === dto.customerId)?.orders"
          item-title="number"
          item-value="id"
          label="   رقم الطلب  "
        />
      </div>

      <div class="col">
        <VTextarea
          v-model="dto.content"
          rows="1"
          label=" الوصف   "
          :rules="[requiredValidator]"
          :error-messages="errors.content"
        />
      </div>
      

      <div class="col">
        <label class="my-3"> إضافة صورة</label>
        <FileUploader v-model="dto.imageFile" class="" />
      </div>
    </div>
    <div class="mt-14 mx-5 mb-6 sticky bottom-5">
      <VBtn class="mx-5" :loading="isloading" @click="submit">
        إضافة شكوى
      </VBtn>
      <VBtn color="primary" variant="outlined" @click="$emit('dialog')">
        <VIcon>tabler:table-import</VIcon> تراجع
      </VBtn>
    </div>
  </VForm>
</template>
