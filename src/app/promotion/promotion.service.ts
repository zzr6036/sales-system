import { Injectable } from "@angular/core";
import { HttpModule, Http, Response } from "@angular/http";
import { global } from "../global";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { Md5 } from "ts-md5/dist/md5";
import { PromotionView } from "./promotion-view.model";
import Swal from "sweetalert2";

@Injectable()
export class PromotionService {
  selectedPromotionCode: PromotionView = new PromotionView();

  constructor(
    public http: Http,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  // Create promotion code, PromotionCode Component
  addPromotion(promotion: any) {
    const promInfo = {
      Id: promotion.Id,
      Code: promotion.Code,
      // "Code": btoa(String(Md5.hashAsciiStr(promotion.Code)).toUpperCase()),
      StartTime: promotion.StartTime,
      EndTime: promotion.EndTime,
      Qty: promotion.Qty,
      MerchantId: promotion.MerchantId,
      IsPercent: promotion.IsPercent,
      IsJoint: promotion.IsJoint,
      AssignOnly: promotion.AssignOnly,
      IsSpecial: promotion.IsSpecial,
      MaxRedemptPerUser: promotion.MaxRedemptPerUser,
      Amount: promotion.Amount,
      MinUsed: promotion.MinUsed,
      MaxDiscount: promotion.MaxDiscount,
      Title: promotion.Title,
      Description: promotion.Description,
      Description2: promotion.Description2
    };

    let tokenNo = localStorage.getItem("Token");
    let addUrl = global.host + "addcode" + "?token=" + tokenNo;
    // const addUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/addcode/?token=${localStorage.getItem("Token")}`;
    this.http
      .post(addUrl, promInfo, {})
      .map(res => res.json())
      .subscribe(
        data => {
          if (data["Message"] == undefined) {
            Swal({
              position: "center",
              type: "success",
              title: "Successful!",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(["/promotion"]);
            });
          } else {
            // console.log(data)
            window.alert(data["Message"]);
            console.log(data["Message"]);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  // Update promotion code, Promotion-edit Component
  editPromotion(promotion: any) {
    const editPromInfo = {
      Id: promotion.Id,
      Code: promotion.Code,
      StartTime: promotion.StartTime,
      EndTime: promotion.EndTime,
      Qty: promotion.Qty,
      MerchantId: promotion.MerchantId,
      IsPercent: promotion.IsPercent,
      IsJoint: promotion.IsJoint,
      AssignOnly: promotion.AssignOnly,
      IsSpecial: promotion.IsSpecial,
      MaxRedemptPerUser: promotion.MaxRedemptPerUser,
      Amount: promotion.Amount,
      MinUsed: promotion.MinUsed,
      MaxDiscount: promotion.MaxDiscount,
      Title: promotion.Title,
      Description: promotion.Description,
      Description2: promotion.Description2,
      Status: promotion.Status
    };

    let isExistingCode = editPromInfo["Id"] > 0;
    // console.log(promotion.Id);
    // console.log(editPromInfo["Id"]);
    let tokenNo = localStorage.getItem("Token");
    let editUrl = global.host + "updatecode" + "?token=" + tokenNo;
    // const editUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/updatecode/?token=${localStorage.getItem("Token")}`;
    if (isExistingCode) {
      this.http
        .put(editUrl, editPromInfo, {})
        .map(res => res.json())
        .subscribe(
          data => {
            // console.log(data);
            if (data["Message"] == undefined) {
              this.router.navigate(["/promotion"]);
            } else {
              console.log(data["Message"]);
            }
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  //Display Promotion code list, Promotion Component
  getPromotionList(): Observable<any> {
    let tokenNo = localStorage.getItem("Token");
    let getResUrl = global.host + "promocodes" + "?token=" + tokenNo;
    // let getResUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/promocodes/?token=${localStorage.getItem("Token")}`;
    // console.log(getResUrl);
    return this.http.get(getResUrl, {}).map(res => res.json());
  }

  assignPromCode(promotionCode: any) {
    const promCodeInfo = {
      Code: promotionCode.Code,
      StartTime: promotionCode.StartTime,
      EndTime: promotionCode.EndTime,
      Qty: promotionCode.Qty,
      MerchantId: promotionCode.MerchantId,
      IsPercent: promotionCode.IsPercent,
      IsJoint: promotionCode.IsJoint,
      IsSpecial: promotionCode.IsSpecial,
      AssignOnly: promotionCode.AssignOnly,
      MaxRedemptPerUser: promotionCode.MaxRedemptPerUser,
      Amount: promotionCode.Amount,
      MinUsed: promotionCode.MinUsed,
      MaxDiscount: promotionCode.MaxDiscount,
      Title: promotionCode.Title,
      Description: promotionCode.Description,
      Description2: promotionCode.Description2,
      UserId: promotionCode.UserId
    };

    let tokenNo = localStorage.getItem("Token");
    let assignUrl = global.host + "promocodes" + "?token=" + tokenNo;
    // const assignUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/promocodes/?token=${localStorage.getItem("Token")}`;
    this.http
      .post(assignUrl, promCodeInfo, {})
      .map(res => res.json())
      .subscribe(
        data => {
          // console.log(data);
          // console.log(assignUrl)
          if (data["Message"] == undefined) {
            this.router.navigate(["/promotion"]);
          } else {
            console.log(data["Message"]);
          }
        },
        error => {
          console.log(error);
        }
      );
  }
}
