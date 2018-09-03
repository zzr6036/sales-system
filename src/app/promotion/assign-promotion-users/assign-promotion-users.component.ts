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
  selector: 'app-assign-promotion-users',
  templateUrl: './assign-promotion-users.component.html',
  styleUrls: ['./assign-promotion-users.component.scss']
})
export class AssignPromotionUsersComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  promotionCodes: any;
  userInfoes: Array<any> = [];
  assignUsersPromoCode: any;

  // UserInfoes Sample
  // userInfoes =[{Id: 1, Name: "Peter", MobileNo: "+65-98657865", Email: "peter123@gmail.com", Balance: 22.15, Selection: false},
  //              {Id: 2, Name: "Amy", MobileNo: "+65-98657335", Email: "amy@gmail.com", Balance: 3.25, Selection: false}]
  minValue: Number;
  maxValue: Number;
  balanceArray: Array<any> = [];
  balanceArrayList: Array<any> = [];

  // User Selection
  Selection: String;
  checkboxSelectedUsers: Array<any> = [];
  selectedUsers = [];
  selectedUsersObj = [];
  selectedAll = false;


  // Filter by balance
  userObject = {}
  userList: Array<any> = [];

  constructor( public http: Http, private router: Router, private route: ActivatedRoute) { }

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

  checkAll(){
    if(this.selectedAll){
      this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(true); 
      this.selectedUsersObj = this.userInfoes;
    }
    else{
      this.selectedUsers = new Array<boolean>(this.userInfoes.length).fill(false); 
      this.selectedUsersObj = [];
    }
  }

  BalanceRange(){
    let tokenNo = localStorage.getItem("Token")
    let userListUrl = global.host + 'search/' + 'user/' + '?keyword=' + '&token=' + tokenNo;
    for(var i=0; i<this.userInfoes.length; i++){
      if(this.minValue < this.userInfoes[i]["XinDollar"] && this.maxValue > this.userInfoes[i]["XinDollar"]){
        this.userObject = this.userInfoes[i];
        this.userList.push(this.userObject);
        console.log(this.userList);
        this.userObject = {};
        this.userInfoes = this.userList;
        // let seq = i;
        // this.http.get(userListUrl, {}).map(res => res.json()).subscribe(data => {
        //   this.userObject = data[seq];
        //   this.userList.push(this.userObject);
        //   this.userObject = {};
        //   this.userInfoes = this.userList;
        // })
      }
    }
  }

  submit(){
    let i = 0;
    for(let isSelected of this.selectedUsers){
      if(isSelected){
        this.selectedUsersObj.push(this.userInfoes[i]);
      }
      ++i;
    }
    console.log(this.selectedUsersObj.length)
    // Assign Promotion Code to selected user
    let tokenNo = localStorage.getItem("Token");
    let assignPromoCodeUrl = global.host + 'promocodes/' + '?token=' + tokenNo;
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
        UserId: this.selectedUsersObj[n]["Id"],
      }
      // console.log(this.assignUsersPromoCode.UserId);
    }
    
    if(this.promotionDetail.IsSpecial == true){
        Swal({
          position: 'center',
          type: 'info',
          title: 'The Special Promotion Code is not allowed to assign customer',
          showConfirmButton: true,
        }).then(()=>{
          this.router.navigate(['/promotion/']);
        })
      }
    // else{
    //   if(this.promotionDetail.Qty > 0){
    //     console.log("1");
    //     for(var m=0; m<this.selectedUsersObj.length; i++){
    //       this.http.post(assignPromoCodeUrl, this.assignUsersPromoCode, {}).map(res => res.json()).subscribe(data => {
    //         // console.log(data);
    //         if(data["Message"] == undefined){
    //           console.log("Hello")
    //         }
    //       })
    //     }
    //   }
    // }
    console.log(this.selectedUsersObj)
  }
}
