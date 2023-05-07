<script setup lang="ts">
import { useShopStore } from "@/stores/Shop";
import { requiredValidator } from "@/@core/utils/validators";
import { useSubStore } from "@/stores/Subsecrption";
import { VForm } from "vuetify/components";

const shopStore = useShopStore();
const {SearchShops}=storeToRefs(shopStore)
const store = useSubStore();
const emit = defineEmits(["dialog"]);
const shop = ref("");
const isLoading = ref(false);

const refForm = ref<InstanceType<typeof VForm>>();
const props = defineProps(["id"]);
const errors = ref<Record<string, string>>({
  selected: "",
});

onBeforeMount(() => {
  shopStore.GetAllBranches(SearchShops.value);
});
const { shops } = storeToRefs(shopStore);
const submit = () => {
  refForm.value?.validate().then((res) => {
    if (res.valid) {
      isLoading.value = true;
      store
        .addBranch({
          id: props.id,
          branchId: shop.value,
        })
        .then(() => {
          isLoading.value = false;
          emit("dialog");
        });
    }
  });
};
</script>
<template>
  <VCardText>
    <VForm ref="refForm">
      <VRow>
        <VCol cols="12" md="12">
          <h3 class="pb-3">اسم المتجر</h3>
          <VSelect
            :items="shops"
            v-model="shop"
            item-title="name"
            item-value="id"
            :rules="[requiredValidator]"
            :error-messages="errors.selected"
          />
        </VCol>
        <VCol cols="10" md="0"></VCol>
      </VRow>
      <div class="sticky w-full">
        <VBtn @click="submit" class="ml-3" :loading="isLoading">إضافة</VBtn>
        <VBtn @click="$emit('dialog')" variant="outlined">
          <VIcon>tabler:table-import</VIcon> تراجع</VBtn
        >
      </div>
    </VForm>
  </VCardText>
</template>
