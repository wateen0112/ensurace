export class  SubscribtionDto {
  id= "";
  number= 0;
  name= "";
  period= 0;
  branchesCount= 0;
  price= 0;
  note='';
  profitPercent=0;
}

export class GetSubscriptionByIdDto {
  id= '';
  name= '';
  period= 0;
  number=0;
  note= '';
  price= 0;
  profitPercent= 0;
  branchesCount= 0;
  branches= <Branch[]>[];
}

export class  Branch {
  name= '';
  
  id="";
  startDate= '';
  selected=false;
  endDate= '';
  profitPercent= '';
  price= '';
}
