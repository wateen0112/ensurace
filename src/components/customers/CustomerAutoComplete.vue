<script lang="ts" setup>
import { CustomerApi } from "@/api/Customer/endpoints";

import { useApi } from "@/composables";
import type { CustomerSearchDTO } from "@/api/Customer/dto";

const emit = defineEmits(["update:modelValue"]);
const { GET } = useApi();
const timeOutSearch = ref();
const searchLoader = ref(false);
const searchResults = ref<CustomerSearchDTO[]>([]);
function emitCustomerId(id: string) {
  emit("update:modelValue", id);
}

function searchInServer(query: string) {
  clearTimeout(timeOutSearch.value);

  timeOutSearch.value = setTimeout(async () => {
    if (query.length) {
      try {
        searchLoader.value = true;

        const { data: result } = await GET<CustomerSearchDTO[]>(
          CustomerApi.Search,
          { query, loading: false },
          { error: true }
        );

        searchLoader.value = false;
        searchResults.value = result;
      } catch (er) {
        searchLoader.value = false;
      }
    }
  }, 500);
}
</script>

<template>
  <VAutocomplete
    cache-items
    hide-details
    :items="searchResults"
    label="ابحث عن زبون"
    item-value="id"
    item-title="name"
    no-filter
    :loading="searchLoader"
    hide-no-data
    density="comfortable"
    placeholder="ابحث عن زبون عن طريق الاسم او رقم الهاتف"
    class="flex-grow"
    @update:model-value="emitCustomerId"
    @update:search="searchInServer"
  />
</template>
