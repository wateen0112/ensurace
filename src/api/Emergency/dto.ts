// export interface ChartJsCustomColors {
//   white='',
//   yellow='',
//   primary= '',
//   areaChartBlue= '',
//   barChartYellow= '',
//   polarChartGrey= '',
//   polarChartInfo= '',
//   lineChartYellow= '',
//   polarChartGreen= '',
//   lineChartPrimary= '',
//   lineChartWarning= '',
//   horizontalBarInfo= '',
//   polarChartWarning= '',
//   scatterChartGreen= '',
//   warningShade= '',
//   areaChartBlueLight= '',
//   areaChartGreyLight= '',
//   scatterChartWarning= '',
// } 
export class EmergencyDto {
  id='';

  number=0;
  dateCreated='';
  branchesNames=[];
  customerName='';
  phoneNumber='';
  orderNumber=0;
  address='';
  replayType?='';
  isReplied=0;
}
export class getEmrByIdDto {
  id= '';
  number= 0;
  dateCreated= '';
  customerPhoneNumber= '';
  customerName= '';
  orderNumber= 0;
  address= '';
  reply?= ''
  replayType=''
  orderType='';
  replyDate?= '';
  dashUserName?= '';
  driver= new Driver();
}


class  Driver {
  name= '';
  phoneNumbers= [];
}
  



export class ReplyDto {
  id= '';
  reply= '';
  replayType= '';
}
