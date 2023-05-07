<script setup lang="ts">
import Areas from '@/components/settings/areas/index.vue';
import Categories from '@/components/settings/categories/index.vue';
import Cities from '@/components/settings/cities/index.vue';
import Pricing from '@/components/settings/pricing/deliveryPricing.vue';
import Shops from '@/components/settings/shops/index.vue';
import SystemStandars from '@/components/settings/system/index.vue';
import Users from '@/components/settings/users/index.vue';
import LangSwitcher from '@/components/shared/LangSwitcher.vue';
import { useSettingStore } from '@/stores/Setting';

const store = useSettingStore();
</script>

<template>
  <div>
    <LangSwitcher v-model="store.lang" />
    <div class="grid grid-cols-12 mt-10 gap-5">
      <div class="md:col-span-6 col-span-12">
        <SystemStandars />
      </div>
      <div class="md:col-span-6 col-span-12">
        <Categories />
      </div>
      <div class="md:col-span-6 col-span-12">
        <Cities />
      </div>
      <div class="md:col-span-6 col-span-12">
        <Areas />
      </div>
      <div class="col-span-12">
        <Pricing />
      </div>
      <div class="md:col-span-6 col-span-12">
        <Shops />
      </div>
      <div class="md:col-span-6 col-span-12">
        <Users />
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
  meta:
    roles: ['SuperAdmin' ,'DataEntry']
</route>
