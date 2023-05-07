export class ContactDto {
  id = 0;
  number = 0;
  dateCreated = '';
  customerName = '';
  custoemrPhoneNumber = '';
  orderNumber = 0;
  isReplied = false;
}
export class ReplyDto {
  reply = '';
  id = '';
}

export class AddContactDto {
  customerId = '';
  orderId = '';
  title = '';
  content = '';
  imageFile = null;
}
export class GetContactByIdDto {
  id = '';
  number = '';
  customerName = '';
  customerPhoneNumber = '';
  customerEmail? = '';
  orderNumber? = '';
  dateCreated = '';
  title = '';
  content = '';
  imageUrl = '';
  reply? = '';
  isRead = false;
  repliedDashUserName? = '';
  repliedDashUserImageUrl? = '';
}
