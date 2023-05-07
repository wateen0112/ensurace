<script setup>
import { useContactStore } from '@/stores/ContactUs';
import ContactsTable from '@/components/contactUs/ContactsTable.vue';
const store = useContactStore();
onBeforeMount(()=>{
  store.getAllContacts();
})
</script>
<template>
  <div>
    <!-- tailwind styles example -->
   
    <ContactsTable/>
  </div>
</template>

<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry']
  </route>
