<script setup lang="ts">
import { useOrderStore } from "@/stores/Order";
import { Order_Stage } from "@/enums/OrderStage";

const orderStore = useOrderStore();
</script>

<template>
  <div>
    <VCard class="h-screen w-full">
      <VTimeline align="center" side="end">
        <VTimelineItem
          v-if="$route.query.isConfirmedOrder === '1'"
          :dot-color="
            $route.query.isConfirmedOrder === '1' ? 'primary' : 'secondary'
          "
          :icon="
            $route.query.isConfirmedOrder === '1'
              ? 'mdi-checkbox-marked-circle-outline'
              : 'mdi-cart'
          "
          fill-dot
        >
          <h2>طلب جديد</h2>
        </VTimelineItem>
        <VTimelineItem
          v-if="$route.query.isConfirmedOrder === '0'"
          :dot-color="
            $route.query.isConfirmedOrder === '0' ? 'primary' : 'secondary'
          "
          :icon="
            $route.query.isConfirmedOrder === '0'
              ? 'mdi-checkbox-marked-circle-outline'
              : 'mdi-bicycle '
          "
          fill-dot
        >
          <h2>معالجة الطلب</h2>
        </VTimelineItem>
        <VTimelineItem
          :dot-color="
            $route.query.tellBranches === '1' ? 'primary' : 'secondary'
          "
          :icon="
            $route.query.tellBranches === '1'
              ? 'mdi-checkbox-marked-circle-outline'
              : 'mdi-store '
          "
          fill-dot
        >
          <h2>إعلام المتجر</h2>
        </VTimelineItem>
        <VTimelineItem
          :dot-color="
            $route.query.isConfirmedOrder === '1' &&
            $route.query.isConfirmedDriver === '1'
              ? 'primary'
              : 'secondary'
          "
          :icon="
            $route.query.isConfirmedOrder === '1' &&
            $route.query.isConfirmedDriver === '1'
              ? 'mdi-checkbox-marked-circle-outline'
              : 'mdi-bicycle '
          "
          fill-dot
        >
          <h2>إعلام السائق</h2>
        </VTimelineItem>
        <VTimelineItem
          :dot-color="
            $route.query.isConfirmedOrder === '1' &&
            $route.query.isConfirmedDriver === '1' &&
            $route.query.receivedFromBranches === '1'
              ? 'primary'
              : 'secondary'
          "
          :icon="
            $route.query.isConfirmedOrder === '1' &&
            $route.query.isConfirmedDriver === '1' &&
            $route.query.receivedFromBranches === '1'
              ? 'mdi-checkbox-marked-circle-outline'
              : 'mdi-store'
          "
          fill-dot
        >
          <h2>استلام من المتجر</h2>
        </VTimelineItem>
        <VTimelineItem
          v-if="$route.query.rollBack === '1'"
          :dot-color="$route.query.rollBack === '1' ? 'error' : 'secondary'"
          icon="mdi-cart"
          fill-dot
        >
          <h2>ارجاع الطلب</h2>
        </VTimelineItem>
        <VTimelineItem
          v-if="$route.query.rollBack === '0'"
          :dot-color="
            $route.query.isConfirmedOrder === '1' &&
            $route.query.isConfirmedDriver === '1' &&
            $route.query.receivedFromBranches === '1' &&
            $route.query.receivedToCustomer === '1'
              ? 'primary'
              : 'secondary'
          "
          :icon="
            $route.query.isConfirmedOrder === '1' &&
            $route.query.isConfirmedDriver === '1' &&
            $route.query.receivedFromBranches === '1' &&
            $route.query.receivedToCustomer === '1'
              ? 'mdi-checkbox-marked-circle-outline'
              : 'mdi-account'
          "
          fill-dot
        >
          <h2>تسليم الزبون</h2>
        </VTimelineItem>
      </VTimeline>
    </VCard>
  </div>
</template>

<style scoped>
h2 {
  font-size: 20px;
}
</style>
