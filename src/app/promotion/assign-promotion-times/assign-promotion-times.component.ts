import { Component, OnInit } from '@angular/core';
import { PromotionService } from "../promotion.service";
import { PromotionView } from "../promotion-view.model";
import { global } from '../../global';
import { HttpModule, Http, Response } from "@angular/http";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from 'moment';
import { AngularMultiSelect } from 'angular2-multiselect-dropdown/multiselect.component';
import Swal from 'sweetalert2';
import { assertPlatform } from '@angular/core/src/application_ref';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-assign-promotion-times',
  templateUrl: './assign-promotion-times.component.html',
  styleUrls: ['./assign-promotion-times.component.scss']
})
export class AssignPromotionTimesComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  promotionCodes: any;
  userInfoes: Array<any> = [];
  filterUserInfoes: Array<any> = [];
  assignUsersPromoCode: any;
  minValue: Number;
  maxValue: Number;
  assignQty: Number;
  Message: String;
  Subject: string;

  // User Selection
  selectedUsers = [];
  selectedUsersObj = [];
  selectedAll = false;

  // Filter by balance
  userObject = {};
  userList: Array<any> = [];

  constructor( public http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.promotionCodes = window.localStorage.getItem("assignPromoCodeTimes");
    let assignPromoCodeAll = JSON.parse(this.promotionCodes);
    this.promotionDetail.Id = assignPromoCodeAll["Id"];
    this.promotionDetail.Code = assignPromoCodeAll["Code"];
    this.promotionDetail.Title = assignPromoCodeAll["Title"];
    this.promotionDetail.MinUsed = assignPromoCodeAll["MinUsed"];
    this.promotionDetail.StartTime = assignPromoCodeAll["StartTime"];
    // let startTime = moment(assignPromoCodeAll["StartTime"]).add(8, 'hours').format('YYYY-MM-DDTHH:mm:ss');
    // this.promotionDetail.StartTime = startTime;
    this.promotionDetail.EndTime = assignPromoCodeAll["EndTime"];
    // let endTime = moment(assignPromoCodeAll["EndTime"]).add(8, 'hours').format('YYYY-MM-DDTHH:mm:ss');
    // this.promotionDetail.EndTime = endTime;
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
    let getUserUrl = global.host + 'search/' + 'user/' + '?keyword=' + '&token=' + tokenNo;
    this.http.get(getUserUrl, {}).map(res => res.json()).subscribe(data => {
      if(data['Message']){
        console.log(data['Message'])
      }
      else{
        this.userInfoes = data;
        this.initSelectedUser();
      }
    }, error => {
      console.log(error);
    })
  }

  initSelectedUser(){
    this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(false); 
  }

  BalanceRange(){
    this.filterUserInfoes = [];
    for(var i=0; i<this.userInfoes.length; i++){
      if(this.minValue < this.userInfoes[i]["XinDollar"] && this.maxValue > this.userInfoes[i]["XinDollar"]){
        this.filterUserInfoes.push(this.userInfoes[i])
      }  
    }
    this.userInfoes = this.filterUserInfoes;
    if(this.minValue == null || this.maxValue == null){
      this.ngOnInit();
    }
  }

  checkAll(){
    if(this.selectedAll){
      this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(true); 
      this.selectedUsersObj = this.userInfoes;
      // console.log(this.selectedUsersObj)
    }
    else{
      this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(false); 
      this.selectedUsersObj = [];
    }
  }

  submit(){
    //Push all selected user into assign queue
    if(!this.selectedAll){    
      let i = 0;
      for(let isSelected of this.selectedUsers){
        if(isSelected){
          this.selectedUsersObj.push(this.userInfoes[i]);
        }
        ++i;
      } 
    }
     // Assign Promotion Code to selected user
    let tokenNo = localStorage.getItem("Token");
    let assignPromoCodeUrl = global.host + 'promocodes/' + '?token=' + tokenNo;
    this.assignUsersPromoCode = {
      Id:  this.promotionDetail.Id,
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
      UserId: null
    };
    for(var n=0; n<this.assignQty; n++){
      this.recursiveSubmit(0, assignPromoCodeUrl);
    }
}

  recursiveSubmit(inIndex, assignPromoCodeUrl){
    if(inIndex < this.selectedUsersObj.length){
      this.assignUsersPromoCode.UserId = this.selectedUsersObj[inIndex]['Id'];
      if(this.promotionDetail.Qty > this.selectedUsersObj.length){
        this.http.post(assignPromoCodeUrl, this.assignUsersPromoCode, {}).map(res => res.json()).subscribe(data => {
          if(data['Message'] == undefined){
            ++inIndex;
            this.recursiveSubmit(inIndex, assignPromoCodeUrl);
          } else {
            console.log(data['Message'])
            ++inIndex;
            this.recursiveSubmit(inIndex, assignPromoCodeUrl);
          }
        }, error => {
          console.log(error);
          ++inIndex;
          this.recursiveSubmit(inIndex, assignPromoCodeUrl);
        })
      }
      else {
        Swal({
          position: 'center',
          type: 'warning',
          title: '-----Unable Assign to User-----(The quantity of current promotion code is insufficient)',
          showConfirmButton: true
        });
        ++inIndex;
        this.recursiveSubmit(inIndex, assignPromoCodeUrl);
      }
    }
    else {
      this.router.navigate(['/promotion/']);
    }
  }
}
