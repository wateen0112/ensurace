<script lang="ts" setup>
import DriversTable from '@/components/drivers/DriversTable.vue';
import { useDriverStore } from '@/stores/Driver';

const store = useDriverStore();

// const { paginateDrivers, pagination, PagCount } = storeToRefs(store);
// const page = ref(1);

onMounted(() => {
  store.getAllDrivers();
})
</script>

<template>
  <div>
    <!-- tailwind styles example -->
    <DriversTable />
  </div>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin','DataEntry']
  </route>
