<script lang="ts" setup>
import type { Anchor } from 'vuetify/lib/components';
import { avatarText } from '@core/utils/formatters';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/Notification';
import { HOST_DOMAIN } from '../../../app.config';
import type { NotificationUnRead } from '@/api/Notification/dto';
import { useOrderStore } from '@/stores/Order';
import Swal from 'sweetalert2';
import { useEStore } from '@/stores/EStore';
import { useAppStore } from '@/stores/App';

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom end',
  badgeProps: undefined,
});

defineEmits<{
  (e: 'click:readAllNotifications'): void
}>();

const storeOrder = useOrderStore();

const eStore = useEStore();
const { dialog, notificationId } = storeToRefs(eStore);
const { dialogUserHandling } = storeToRefs(useAppStore());
const router = useRouter();
const isDialogVisible = ref(false);
const confirmOrder = ref(false);
const store = useNotificationStore();

// type Notification = {
//   dateCreated: string;
//   notificationDashType: string;
//   onClick: string;
//   title: string;
// };
// type TypeNotification = {
//   value: string;
//   type: string;
// };
interface Props {
  notifications: NotificationUnRead[]
  badgeProps?: unknown
  location?: Anchor
}

function readNotification(item: NotificationUnRead) {
  console.log(item);
  if (item.notificationDashType === 'NewContactUs')
    router.push(`${`/${item.onClick}`}`);
  else if (item.notificationDashType === 'DelayOrder')
    handleDelayOrder(item);
  else if (item.notificationDashType === 'NewOrder')
    handleNewOrder(item);

}
function handleNewOrder(item: NotificationUnRead) {
  console.log('handle new order', item);

  Swal.fire({
    text: 'هل تريد معالجة الطلب؟! ',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    cancelButtonText: 'عدم معالجة الطلب',
    confirmButtonText: 'معالجة الطلب',
  }).then(result => {
    if (result.isConfirmed) {
      // isDialogVisible.value = true;
      storeOrder.HandlerOrder(item.newOrder.orderId).then(res => {
        if (res?.status === 200) {
          store.ReadNoti(item.id).then(() => {
            store.NotificationsUnRead = store.NotificationsUnRead.filter(
              ele => ele.id !== item.id,
            );
          });

          router.push({
            path: `/content-management/orders/stage/ConfirmOrder/${item.newOrder.orderId}`,
            query: {
              stage: item.notificationDashType,
              isConfirmedOrder: 0,
              tellBranches: 0,
              isConfirmedDriver: 0,
              receivedFromBranches: 0,
              receivedToCustomer: 0,
              rollBack: 0,
            },
          });

          storeOrder.GetConfirmedOrderById(item.newOrder.orderId);
        }
      });
    }
  });

  console.log(item);
}

function handleDelayOrder(notification: NotificationUnRead) {
  notificationId.value = notification.id;
  eStore.getById(notification.delayOrder.delayOrderId).then(() => {
    dialog.value = true;
  });
}
</script>

<template>
  <div>
    <VBadge :model-value="!!props.badgeProps" v-bind="props.badgeProps">
      <VBtn icon variant="text" color="default" size="small">
        <VBadge :model-value="!!props.notifications.length" color="error" :content="props.notifications.length">
          <VIcon icon="tabler-bell" size="24" />
        </VBadge>

        <VMenu activator="parent" width="380px" :location="props.location" offset="14px">
          <VList class="py-0">
            <!-- 👉 Header -->
            <VListItem title="Notifications" class="notification-section" height="48px">
              <template #append>
                <VChip v-if="props.notifications.length" color="primary" size="small">
                  {{ props.notifications.length }} New
                </VChip>
              </template>
            </VListItem>

            <VDivider />

            <!-- 👉 Notifications list -->
            <!-- {{ props.notifications }} -->

            <template v-for="notification in props.notifications" :key="notification.title">
              <VListItem :title="notification.title" :subtitle="
                `${new Date(notification.dateCreated).toLocaleDateString()
                }  ${new Date(notification.dateCreated).toLocaleTimeString()}`
              " link lines="one" min-height="66px" @click="readNotification(notification)">
                <!-- Slot: Prepend -->
                <!-- Handles Avatar: Image, Icon, Text -->
                <template #prepend>
                  <VListItemAction start>
                    <VAvatar image="https://freeiconshop.com/wp-content/uploads/edd/notification-flat.png" size="40"
                      variant="tonal" />
                  </VListItemAction>
                </template>
                <!-- Slot: Append -->

                <template #append>
                  <small class="whitespace-no-wrap text-medium-emphasis">{{
                    store.notificationType.find(
                      (ele) => ele.type == notification.notificationDashType,
                    )?.value
                  }}</small>
                </template>
              </VListItem>
              <VDivider />
            </template>

            <!-- 👉 Footer -->
            <VListItem class="notification-section">
              <!-- $emit('click:readAllNotifications') -->
              <VBtn block @click="store.ReadNoti(null)">
                READ ALL NOTIFICATIONS
              </VBtn>
            </VListItem>
          </VList>
        </VMenu>
      </VBtn>
    </VBadge>
  </div>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}
</style>
