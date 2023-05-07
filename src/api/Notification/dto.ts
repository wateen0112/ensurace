export interface NotificationAll {
  id: string
  title: string
  body: string
  dateCreated: string
  selected: boolean
  sendToNames: string[]
  isSendToAll: boolean
  notificationDashType: string
  isNew: boolean
  onClick: string
}


export interface AddNotification {
  id: string
  title: string
  body: string
  sendToIds: string[]
  sendToAll: boolean
}

export interface NotificationDto {
  sent: NotificationAll[]
  receive: NotificationAll[]
}
export class NotificationReceive {
  receive = {
    title: '',
    dateCreated: [],
  };
}
export class AddNotificationDto {
  id = '';
  title = '';
  body = '';
  sendToIds = [];
  sendToAll = false;
}



export class NotificationUnRead {
  id = '';
  title = '';
  dateCreated = '';
  notificationDashType = '';
  onClick = '';
  newOrder = {
    orderId: "",
    orderType: "",
    dateTime: "",
    orderNumber: 0,
    customerFullName: "",
    customerPhoneNumber: "",
  } as NewOrder
  delayOrder = DelayOrder;
  newContactUs = NewContactUs;
}

export class NewContactUs {
  id = '';
  title = '';
  content = '';
  imageUrl = '';
}

export class DelayOrder {
  static delayOrderId(arg0: string, delayOrderId: any) {
    throw new Error('Method not implemented.')
  }
  orderId = "";
  delayOrderId = "";
  orderType = "";
  customerId = "";
  customerFullName = "";
  customerPhoneNumber = "";
  branches: Branch[] = [];
}

export class Branch {
  id = '';
  name = '';
  phoneNumber = '';
}

export class NewOrder {
  orderId = '';
  orderType = '';
  dateTime = '';
  orderNumber = 0;
  customerFullName = '';
  customerPhoneNumber = '';
}
