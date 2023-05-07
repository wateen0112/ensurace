<script setup lang="ts">
import XHRLoader from "@/components/shared/XHRLoader.vue";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { hexToRgb } from "@layouts/utils";
import { useTheme } from "vuetify";
import { useEStore } from "./stores/EStore";
import { useAppStore } from "./stores/App";
import { isLoggedIn, useAuth } from "./@core/composable/useAuth";
import { HOST_DOMAIN } from "../app.config";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useNotificationStore } from "@/stores/Notification";
import { useOrderStore } from "@/stores/Order";
import { storeToRefs } from "pinia";
import Emsg from "./components/emergency/Emsg.vue";
const appStore = useAppStore();

const { NotificationsUnRead } = storeToRefs(useNotificationStore());
const eStore = useEStore();
const { dialog } = storeToRefs(eStore);
const { dialogUserHandling } = storeToRefs(useAppStore());
const { handleOrderDto } = storeToRefs(useOrderStore());

const { GetAccessToken } = useAuth();
const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
} = useThemeConfig();
const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme();
syncConfigThemeWithVuetifyTheme();

const connection = new HubConnectionBuilder()
  .withUrl(`${HOST_DOMAIN}/NotificationHub?access_token=${GetAccessToken()}`)
  .configureLogging(LogLevel.Information)
  .build();

connection.on("NewNotification", (data) => {
  console.log(data);
  NotificationsUnRead.value.unshift(data);
});
connection.start();

if (isLoggedIn()) appStore.startupCalls();
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
    >
      <VDialog v-model="dialog" width="900">
        <Emsg />
      </VDialog>
      <RouterView />
      <XHRLoader v-if="appStore.isLoading" />
    </VApp>
  </VLocaleProvider>
</template>
