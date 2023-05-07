<script setup lang="ts">
import Page from  '@/components/shared/Page.vue'
import ETable from '@/components/emergency/ETable.vue';
import { useAppStore } from '@/stores/App';
import {useEStore}from '@/stores/EStore';
const store  = useEStore();
onBeforeMount ( ()=>{
store.getAll();
})
useAppStore().SetPageMeta({
  title:'نظام الطوارئ | رسائل التنبيه'
  ,icon:'mdi-call',
  breadCrumb: [],
})
</script>
<template>
<Page :add="false"
placeholder="ابحث  عن رسالة  معينة"
>
<ETable/>
</Page>
</template>
<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'OrderHandler']
  </route>
