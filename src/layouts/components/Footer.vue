<script lang="ts" setup>
import p from '@/../package.json'

const version = computed(() => p.version)
</script>

<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center gap-x-2">
      &copy;
      {{ new Date().getFullYear() }}
      <a href="https://www.facebook.com/Elkood?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer"
        class="text-primary ms-1">ELKOOD</a>
      <span>Powered By</span>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-2 d-none">
      <a class="text-primary" href="" target="noopener noreferrer">Fly Order v {{ version }} </a>
      <span>All Rights Reserved</span>
    </span>
  </div>
</template>
