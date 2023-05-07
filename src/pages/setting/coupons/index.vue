<script setup lang="ts">

import CouponsTable from '@/components/coupons/CouponsTable.vue'
</script>

<template>

<CouponsTable/>

</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'Marketer']
</route>
