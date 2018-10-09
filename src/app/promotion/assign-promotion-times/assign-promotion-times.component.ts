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

@Component({
  selector: 'app-assign-promotion-times',
  templateUrl: './assign-promotion-times.component.html',
  styleUrls: ['./assign-promotion-times.component.scss']
})
export class AssignPromotionTimesComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  promotionCodes: any;
  userInfoes: Array<any> = [];
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
    let tokenNo = localStorage.getItem("Token")
    let userListUrl = global.host + 'search/' + 'user/' + '?keyword=' + '&token=' + tokenNo;
    for(var i=0; i<this.userInfoes.length; i++){
      if(this.minValue < this.userInfoes[i]["XinDollar"] && this.maxValue > this.userInfoes[i]["XinDollar"]){
        let seq = i;
        this.http.get(userListUrl, {}).map(res => res.json()).subscribe(data => {
          this.userObject = data[seq];
          this.userList.push(this.userObject);
          this.userObject = {};
        })
      }  
    }
    this.userInfoes = this.userList;

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
    for(var i=0; i<this.assignQty; i++){
      for(var n=0; n<this.selectedUsersObj.length; n++){
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
        UserId: this.selectedUsersObj[n]["Id"],
      }
      if(this.promotionDetail.IsSpecial == true){
        Swal({
          position: 'center',
          type: 'info',
          title: 'The Special Promotion Code is not allowed to assign customer',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigate(['/promotion']);
        })
      }
      else{
        if(this.promotionDetail.Qty > this.selectedUsersObj.length){
          this.http.post(assignPromoCodeUrl, this.assignUsersPromoCode, {}).map(res => res.json()).subscribe(data => {
            // console.log(data)
            if(data["Message"] == undefined){
              this.router.navigate(['/promotion/']);
              // Swal({
              //   position: 'center',
              //   type: 'success',
              //   title: 'Assign Successfully',
              //   showConfirmButton: false,
              //   timer: 1500,
              // }).then(() => {
              //   this.router.navigate(['/promotion/']);
              // })
            }
            else{
              console.log(data["Message"]);
            }
      }, error => {
        console.log(error);
      })
        }
        else {
          Swal({
            position:'center',
            type:'warning',
            title: '-----Unable Assign to User-----(The quantity of current promotion code is insufficient)',
            showConfirmButton: true,
          })
        }
      }
    }
    }
    
    // console.log(this.selectedUsersObj)
  }
}
