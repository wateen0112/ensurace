export interface Customers {
  id: string;
  number: number;
  customerName: string;
  customerPhoneNumber: string;
  driverName: string;
  driverPhoneNumber: string;
  branchs: ratingBranch[];
  isEvaluated: boolean;
}
export interface GetRatings {
  count: number;
  orders: Customers[];
}
export interface ratingBranch {
  id: string;
  name: string;
  isEvaluated: boolean;
}
export class UpsertBranchEvaluation {
  id = null;
  note = "";
  value = 0;
  imageUrl = "";
  imageFile = null;
  branchId = "";
  isEvaluated = true;
}

export class GetIdRating {
  id = "";
  number = 0;
  orderType = "";
  customerName = "";
  customerPhoneNumber = "";
  driversEvaluation = {
    driverId: "",
    name: "",
    phoneNumber: "",
    note: "",
    imageUrl: "",
    imageFile: null,
    value: 0,
  };

  branchesEvaluated: BranchsEvaluation[] = [];
}

export class BranchsEvaluation {
  branchId = "";
  name = "";
  category = "";
  value = 0;
  imageUrl = "";
  note = "";
  isEvaluated = false;
}
