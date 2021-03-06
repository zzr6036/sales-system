import { Md5 } from "ts-md5/dist/md5";

export class PromotionView {
    Id: Number;
    Code: String;
    StartTime: String
    EndTime: String; 
    IsPercent: Boolean;
    IsJoint: Boolean;
    IsSpecial: Boolean;
    AssignOnly: Boolean;
    Qty: Number;
    MerchantId: Number;
    Amount: Number;
    MaxRedemptPerUser: Number;
    MinUsed: Number;
    MaxDiscount: Number;
    Title: String;
    Description: String;
    Description2: String;
    Status: String;
    CreatedByUserId: Number;
    DeleteByUserId: Number;
    Image: String;
    HawkerCenterId: Number;
}