import { Component, OnInit, AfterViewInit } from "@angular/core";
import { PromotionService } from "../promotion.service";
import { PromotionView } from "../promotion-view.model";
import { global } from "../../global";
import { HttpModule, Http, Response } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { AngularMultiSelect } from "angular2-multiselect-dropdown/multiselect.component";
import Swal from "sweetalert2";
import { assertPlatform } from "@angular/core/src/application_ref";

@Component({
  selector: "app-assign-promotion-users",
  templateUrl: "./assign-promotion-users.component.html",
  styleUrls: ["./assign-promotion-users.component.scss"]
})
export class AssignPromotionUsersComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  promotionCodes: any;
  userInfoes: Array<any> = [];
  filterUserInfoes: Array<any> = [];
  assignUsersPromoCode: any;
  minValue: Number;
  maxValue: Number;
  minId: Number;
  maxId: Number;
  assignQty: Number;
  Message: String;
  Subject: string;

  //loading bar
  value = 0;

  // User Selection
  selectedUsers = [];
  selectedUsersObj = [];
  selectedAll = false;
  userObject = {};
  userList: Array<any> = [];
  // Filter by balance

  constructor(
    public http: Http,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.promotionCodes = window.localStorage.getItem("assignPromoCodeAll");
    let assignPromoCodeAll = JSON.parse(this.promotionCodes);
    this.promotionDetail.Id = assignPromoCodeAll["Id"];
    this.promotionDetail.Code = assignPromoCodeAll["Code"];
    this.promotionDetail.Title = assignPromoCodeAll["Title"];
    this.promotionDetail.MinUsed = assignPromoCodeAll["MinUsed"];
    this.promotionDetail.StartTime = assignPromoCodeAll["StartTime"];
    this.promotionDetail.EndTime = assignPromoCodeAll["EndTime"];
    this.promotionDetail.Qty = assignPromoCodeAll["Qty"];
    this.promotionDetail.IsSpecial = assignPromoCodeAll["IsSpecial"];
    this.promotionDetail.IsPercent = assignPromoCodeAll["IsPencent"];
    this.promotionDetail.IsJoint = assignPromoCodeAll["IsJoint"];
    this.promotionDetail.AssignOnly = assignPromoCodeAll["AssignOnly"];
    this.promotionDetail.MerchantId = assignPromoCodeAll["MerchantId"];
    this.promotionDetail.Amount = assignPromoCodeAll["Amount"];
    this.promotionDetail.MaxRedemptPerUser = assignPromoCodeAll["MaxRedemptPerUser"];
    this.promotionDetail.MaxDiscount = assignPromoCodeAll["MaxDiscount"];
    this.promotionDetail.Description = assignPromoCodeAll["Description"];
    this.promotionDetail.Description2 = assignPromoCodeAll["Description2"];
    this.promotionDetail.Status = assignPromoCodeAll["Status"];
    this.promotionDetail.CreatedByUserId = assignPromoCodeAll["CreatedByUserId"];
    this.promotionDetail.DeleteByUserId = assignPromoCodeAll["DeleteByUserId"];
    this.promotionDetail.Image = assignPromoCodeAll["Image"];

    let tokenNo = localStorage.getItem("Token");
    let getUserUrl = global.host + "search/" + "user/" + "?keyword=" + "&token=" + tokenNo;
    this.http.get(getUserUrl, {}).map(res => res.json()).subscribe(data => {
          if (data["Message"]) {
            console.log(data["Message"]);
          } else {
            this.userInfoes = data;
            this.filterUserInfoes = data;
            this.initSelectedUser();
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  initSelectedUser() {
    this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(false);
  }
  // ngAfterViewInit() {
  //   const loadingBar = setInterval(() => {
  //     this.value <this.userInfoes.length ? this.value++ : clearInterval(loadingBar);
  //   }, 100);
  //   console.log(this.value)
  // }

  BalanceRange() {
    let tokenNo = localStorage.getItem("Token");
    let userListUrl = global.host + "search/" + "user/" + "?keyword=" + "&token=" + tokenNo;
    this.filterUserInfoes = [];
    for (var i = 0; i < this.userInfoes.length; i++) {
      if (this.minValue < this.userInfoes[i]["XinDollar"] && this.maxValue > this.userInfoes[i]["XinDollar"]) {
        this.filterUserInfoes.push(this.userInfoes[i])
      }
    }
    this.userInfoes = this.filterUserInfoes;

    if (this.minValue == null || this.maxValue == null) {
      this.ngOnInit();
    }
  }

  IdRangeCheck(){
    let tokenNo = localStorage.getItem("Token");
    let userListUrl = global.host + "search/" + "user/" + "?keyword=" + "&token=" + tokenNo;
    this.filterUserInfoes = [];
    for(var n=0; n<this.userInfoes.length; n++){
      if(this.minId < this.userInfoes[n]['Id'] && this.maxId > this.userInfoes[n]['Id']){
        this.filterUserInfoes.push(this.userInfoes[n]);
      }
    }
    this.userInfoes = this.filterUserInfoes;
  }

  checkAll() {
    if (this.selectedAll) {
      this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(true);
      this.selectedUsersObj = this.userInfoes;
      // console.log(this.selectedUsersObj)
    } else {
      this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(false);
      this.selectedUsersObj = [];
    }
    // console.log(this.selectedUsers)
  }

  submit() {
    //Push all selected user into assign queue
    if (!this.selectedAll) {
      let i = 0;
      this.selectedUsersObj = [];
      for (let isSelected of this.selectedUsers) {
        if (isSelected) {
          this.selectedUsersObj.push(this.userInfoes[i]);
        }
        ++i;
      }
    }
    // Assign Promotion Code to selected user
    let tokenNo = localStorage.getItem("Token");
    let assignPromoCodeUrl = global.host + "promocodes/" + "?token=" + tokenNo;
    this.assignUsersPromoCode = {
      Id: this.promotionDetail.Id,
      Code: this.promotionDetail.Code,
      Title: this.promotionDetail.Title,
      MinUsed: this.promotionDetail.MinUsed,
      StartTime: this.promotionDetail.StartTime,
      EndTime: this.promotionDetail.EndTime,
      Qty: this.promotionDetail.Qty,
      IsSpecial: this.promotionDetail.IsSpecial,
      IsPercent: this.promotionDetail.IsPercent,
      IsJoint: this.promotionDetail.IsJoint,
      AssignOnly: this.promotionDetail.AssignOnly,
      MerchantId: this.promotionDetail.MerchantId,
      Amount: this.promotionDetail.Amount,
      _maxRedempt: 0,
      MaxDiscount: this.promotionDetail.MaxDiscount,
      Description: this.promotionDetail.Description,
      Description2: this.promotionDetail.Description2,
      Status: this.promotionDetail.Status,
      Message: this.Message,
      Subject: this.Subject,
      CreatedByUserId: this.promotionDetail.CreatedByUserId,
      DeleteByUserId: this.promotionDetail.DeleteByUserId,
      Image: this.promotionDetail.Image,
      //Above attribute all duplicate, only assign to different to different userId 
      UserId: null
    };
    // console.log(this.assignUsersPromoCode)
    this.recursiveSubmit(0, assignPromoCodeUrl);
  }

  //The recursive function to ensure assign and get response from each user before assign to next user
  recursiveSubmit(inIndex, assignPromoCodeUrl){
    if(inIndex < this.selectedUsersObj.length){
      this.assignUsersPromoCode.UserId = this.selectedUsersObj[inIndex]["Id"];
      if (this.promotionDetail.Qty > this.selectedUsersObj.length) {
        this.http.post(assignPromoCodeUrl, this.assignUsersPromoCode, {}).map(res => res.json()).subscribe(data => {
          // If post each user successfully,  call recursiveSubmit() function again and assign&check to next user   
          if (data["Message"] == undefined) {
                ++inIndex;
                this.recursiveSubmit(inIndex, assignPromoCodeUrl);
                //if post api unsuccessfully, call recursiveSubmit() function and repeat this step
              } else {
                console.log(data["Message"]);
                ++inIndex;
                this.recursiveSubmit(inIndex, assignPromoCodeUrl);
              }
            },
            error => {
              console.log(error);
              ++inIndex;
              this.recursiveSubmit(inIndex, assignPromoCodeUrl);
            }
          );
      } else {
        Swal({
          position: "center",
          type: "warning",
          title: "-----Unable Assign to User-----(The quantity of current promotion code is insufficient)",
          showConfirmButton: true
        });
        ++inIndex;
        this.recursiveSubmit(inIndex, assignPromoCodeUrl);
      }
    }
    else{
      this.router.navigate(["/promotion/"]);
    }
    // console.log(this.selectedUsersObj)
  }
}
