import { NotificationApi } from '@/api/Notification/endpoints';
import { defineStore } from 'pinia';
import type {
  NotificationAll,
  AddNotification,
  NotificationDto,
  NotificationUnRead,
} from '@/api/Notification/dto';

import {
  AddNotificationDto,
  NotificationReceive,
} from '@/api/Notification/dto';
import { useApi } from '@/composables/index';

export const useNotificationStore = defineStore('Notification', () => {
  const { GET, POST, DELETE } = useApi();
  const searchVal = ref('');
  const List = ref<NotificationAll[]>([]);
  const serchNotification = ref<NotificationAll[]>([]);
  const Notificationlist = ref<NotificationAll[]>([]);
  const NotReceive = ref<NotificationAll[]>([]);
  const NotificationsUnRead = ref<NotificationUnRead[]>([]);
  const Notification = ref<NotificationAll[]>([]);
  const Addficationlist = ref<AddNotification[]>([]);
  const AddNotDto = ref<AddNotificationDto>(new AddNotificationDto());
  const ReceiveDto = ref(new NotificationReceive());
  interface TypeNotification {
    value: string
    type: string
  }
  const notificationType = ref<TypeNotification[]>([
    {
      value: 'طلب جديد',
      type: 'NewOrder',
    },
    {
      value: 'طلب التأخير',
      type: 'DelayOrder',
    },
    {
      value: 'شكوى جديدة',
      type: 'NewContactUs',
    },
  ]);

  // get all notification
  async function GetAllNotification() {
    try {
      const res = await GET<NotificationDto>(NotificationApi.GetAll);

      List.value = res.data.receive;
      serchNotification.value = res.data.sent;
      Notificationlist.value = res.data.sent;
      NotReceive.value = res.data.receive;

      return res;
    }
 catch (er) {
      console.log(er);
    }
  }

  // get unread
  async function GetUnRead() {
    try {
      const response = await GET<NotificationUnRead[]>(
        NotificationApi.GetUnRead,
        {},
        {},
        {
          headers: {
            lang: 'en',
          },
        },
      );
      NotificationsUnRead.value = response.data;
    }
 catch (error) {
      console.log(error);
    }
  }

  // Add Notification
  async function AddNot(payload: any) {
    const res = await POST(NotificationApi.Add, payload, {
      error: false,
      success: 'تمت الاضافة بنجاح',
    });

    Addficationlist.value?.unshift(payload);
  }

  // Read Notification
  async function ReadNoti(id: string | null) {
    const res = await POST(
      NotificationApi.Read,
      { id },
      { success: 'تم قراءة الاشعار' },
    );
  }

  // Delete  Notification
  async function DeleteNotification(ids: string[]) {
    await DELETE(NotificationApi.Delete, ids);
    NotReceive.value = NotReceive.value?.filter(
      (item: any) => !ids.includes(item.id),
    );
    Notificationlist.value = Notificationlist.value?.filter(
      (item: any) => !ids.includes(item.id),
    );
  }

  // Search
  const search = () => {
    Notificationlist.value = Notificationlist.value.filter((el: any) => {
      return el.title
        .toLowerCase()
        .includes(searchVal.value.toLocaleLowerCase());
    });
      NotReceive.value = NotReceive.value.filter((el: any) => {
        return el.title
          .toLowerCase()
          .includes(searchVal.value.toLocaleLowerCase());
      });
  };
  const filter = () => {
    Notificationlist.value = serchNotification.value;
    NotReceive.value = List.value;
    if (searchVal.value !== '') 
search();
  };

  watch(searchVal, () => {
    filter();
  });

  return {
    searchVal,
    Notification,
    AddNot,
    ReadNoti,
    notificationType,
    GetUnRead,
    GetAllNotification,
    DeleteNotification,
    AddNotDto,
    Notificationlist,
    NotificationsUnRead,
    NotReceive,
    serchNotification,
  };
});
