<script setup lang="ts">
import { VForm } from 'vuetify/components';
import { useNotificationStore } from '@/stores/Notification';
import { useCustomerStore } from '@/stores/Customer';

const emit = defineEmits(['formSubmit']);
const storeCustomer = useCustomerStore();
const Store = useNotificationStore();
const { AddNotDto } = storeToRefs(Store);
const isLoading = ref(false);
const refForm = ref<VForm>();
const selectAll = ref(false);
const selected = ref([]);
const indeterminate = ref(false);
const allSelected = ref(false);

storeCustomer.GetNameCustomer();

function toggleAll(checked) {
  selected.value = checked ? storeCustomer.CustomerName.slice() : [];
}

function cancel() {
  emit('formSubmit');
}

function submit() {
  if (refForm.value?.validate()) {
    AddNotDto.value.sendToAll = allSelected.value;
    if (allSelected.value === false)
      AddNotDto.value.sendToIds = selected.value;
      Store.AddNot(AddNotDto.value).then(() => {
        AddNotDto.value.sendToIds = [];
        AddNotDto.value.sendToAll = false;
        AddNotDto.value.title = '';
        AddNotDto.value.body = '';
        emit('formSubmit');
        Store.GetAllNotification();
    });
  }
}

watch(selected, (newValue, oldValue) => {
  // Handle changes in individual flavour checkboxes
  if (newValue.length === 0) {
    indeterminate.value = false;
    allSelected.value = false;
  }
 else if (newValue.length === storeCustomer.CustomerName.length) {
    indeterminate.value = false;
    allSelected.value = true;
  }
 else {
    indeterminate.value = true;
    allSelected.value = false;
  }
});
</script>

<template>
  <VForm ref="refForm">
    <div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 m-2">
        <div>
          <div class="flex justify-between items-center">
            <label>إرسال الى</label>
            <VCheckbox
              v-model="allSelected"
              label="الجميع"
              color="primary"
              class="w-[110px]"
              hide-details
              @change="toggleAll"
            />
          </div>
          <VSelect
            v-model="selected"
            clearable
            clear-icon="tabler-x"
            item-value="id"
            item-title="name"
            label="إرسال الى"
            :items="storeCustomer.CustomerName"
            multiple
          />
        </div>
        <div>
          <label> عنوان رئيسي </label>
          <VTextField v-model="AddNotDto.title" class="mt-3" />
        </div>
      </div>
      <div>
        <div class="mx-6">
          <VTextarea v-model="AddNotDto.body" label="النص" no-resize />
        </div>
      </div>
    </div>
    <VDivider />

    <div class="mt-3 flex">
      <VBtn
        variant="flat"
        color="primary"
        class="m-2 text-white"
        :loading="isLoading"
        @click="submit"
      >
        إضافة
      </VBtn>
      <VBtn variant="outlined" color="primary" class="m-2" @click="cancel">
تراجع
</VBtn>
    </div>
  </VForm>
</template>
