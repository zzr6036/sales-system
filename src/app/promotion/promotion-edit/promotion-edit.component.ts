import { Component, OnInit, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { global } from "../../global";
import { NgModel } from "@angular/forms";
import { stringify } from "@angular/compiler/src/util";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct, NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";
// import { PromotionCodeService } from "./promotion-code.service";
import { PromotionService } from "../promotion.service";
import { PromotionView } from "../promotion-view.model";
import { log } from "util";
import * as moment from 'moment';

@Component({
  selector: 'app-promotion-edit',
  templateUrl: './promotion-edit.component.html',
  styleUrls: ['./promotion-edit.component.scss']
})
export class PromotionEditComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  Id: Number;
  Status: String;
  promotionCodes:any;
  statusSelections = ["active", "deleted", "expired"];

  //HawkerCenters
  HawkerCenterSelected = [];
  HawkerCenterLists = [];
  //search merchant Id function
  merchantName: String;
  merchantSearchItems: Array<any> = [];
  merchantSelected = [];
  searchSelectedMerchantInfo: Array<any> = [];

   //Expired checking
   public EndTime: String;
   EndTimeArr: Array<any> = [];
   public TodayTime: String;
   //image upload
   loaded = false;

  //Toggle for show
  show: Boolean = false;
  buttonName: any ="Assign to Merchant";

  constructor( public http: Http,
               private router: Router,
               public route: ActivatedRoute,
               private promotionService: PromotionService) { }

  ngOnInit() {
    this.promotionCodes = localStorage.getItem("EditingPromoCode");
    let assignPromotionCodes = JSON.parse(this.promotionCodes);
    this.promotionDetail.Id = assignPromotionCodes["Id"];
    this.promotionDetail.Code = assignPromotionCodes["Code"];
    this.promotionDetail.StartTime = assignPromotionCodes["StartTime"];
    this.promotionDetail.EndTime = assignPromotionCodes["EndTime"];
    this.promotionDetail.IsPercent = assignPromotionCodes["IsPercent"];
    this.promotionDetail.IsJoint = assignPromotionCodes["IsJoint"];
    this.promotionDetail.IsSpecial = assignPromotionCodes["IsSpecial"];
    this.promotionDetail.AssignOnly = assignPromotionCodes["AssignOnly"];
    this.promotionDetail.Qty = assignPromotionCodes["Qty"];
    this.promotionDetail.MerchantId = assignPromotionCodes["MerchantId"];
    this.promotionDetail.Amount = assignPromotionCodes["Amount"];
    this.promotionDetail.MaxRedemptPerUser = assignPromotionCodes["MaxRedemptPerUser"];
    this.promotionDetail.MinUsed = assignPromotionCodes["MinUsed"];
    this.promotionDetail.MaxDiscount = assignPromotionCodes["MaxDiscount"];
    this.promotionDetail.Title = assignPromotionCodes["Title"];
    this.promotionDetail.Description = assignPromotionCodes["Description"];
    this.promotionDetail.Description2 = assignPromotionCodes["Description2"];
    this.promotionDetail.Status = assignPromotionCodes["Status"];
    this.promotionDetail.Image = assignPromotionCodes["Image"];
    this.promotionDetail.HawkerCenterId = assignPromotionCodes["HawkerCenterId"];
    console.log(this.promotionDetail.Image)

    this.expireCheck();
  }

  toggle(){
    this.show = !this.show;

    if(this.show){
      this.buttonName = "Not Assign to Merchant";
    }
    else {
      this.buttonName = "Assign to Merchant";
    }
  }

  searchHawerCenter(){
    let tokenNo = localStorage.getItem('Token');
    let getHawkerCenter = global.host + "HawkerCenters" + "?token=" + tokenNo;
    this.http.get(getHawkerCenter, {}).map(res => res.json()).subscribe(data => {
      // console.log(data)
      if(data['Message']){
        console.log(data['Message']);
      }
      else{
        this.HawkerCenterLists = data;
        this.initSelectedHawkerCenters();
      }
    })
  }

  initSelectedHawkerCenters(){
    this.HawkerCenterSelected = new Array<boolean>(this.HawkerCenterLists.length).fill(false)
  }
  HawkerCenterSelection(){
    let i=0;
    for(let isSelected of this.HawkerCenterSelected){
      if(isSelected){
        this.promotionDetail.HawkerCenterId = this.HawkerCenterLists[i].Id;
      }
      ++i;
    }
    // console.log(this.promotionDetail.HawkerCenterId)
  }

  searchMerchant(){
    let tokenNo = localStorage.getItem("Token");
    let searchUrl = global.host + "Search/" + "?keyword=" + this.merchantName + "&token=" + tokenNo;
    (!this.merchantName)?
    alert('Search can not be empty'):
    this.http.get(searchUrl, {}).map(res => res.json()).subscribe(searchItem => {
      // console.log(searchItem);
      if(searchItem.length>0){
        this.merchantSearchItems = searchItem;
        // console.log(this.merchantSearchItems)
      }
      else{
        alert('Merchant is not existing...')
      }
    })
  }

  initSelectedMerchantId(){
    this.merchantSelected = new Array<boolean>(this.merchantSearchItems.length).fill(false);
  }

  selectedMerchantInfo() {
    let i=0;
    for(let isMerchantSelected of this.merchantSelected){
      if(isMerchantSelected){
        this.searchSelectedMerchantInfo = this.merchantSearchItems[i];
      }
      ++i;
    }
    // console.log(this.searchSelectedMerchantInfo)
  }

  confirmMerchant(){
    this.selectedMerchantInfo();
    this.promotionDetail.MerchantId = this.searchSelectedMerchantInfo['Id'];
  }

  handleFileSelect(event){
    if(event.target.files && event.target.files[0]){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        this.promotionDetail.Image = reader.result;
      }
    reader.readAsDataURL(file)
    }
  }

  expireCheck(){
    const expirePromInfo = {
      "Id":  this.promotionDetail.Id,
      "Code": this.promotionDetail.Code,
      "StartTime": this.promotionDetail.StartTime,
      "EndTime": this.promotionDetail.EndTime,
      "Qty": this.promotionDetail.Qty,
      "MerchantId": this.promotionDetail.MerchantId,
      "IsPercent": this.promotionDetail.IsPercent,
      "IsJoint": this.promotionDetail.IsJoint,
      "IsSpecial": this.promotionDetail.IsSpecial,
      "AssginOnly": this.promotionDetail.AssignOnly,
      "MaxRedemptPerUser":this.promotionDetail.MaxRedemptPerUser,
      "Amount": this.promotionDetail.Amount,
      "MinUsed":  this.promotionDetail.MinUsed,
      "MaxDiscount": this.promotionDetail.MaxDiscount,
      "Title": this.promotionDetail.Title,
      "Description": this.promotionDetail.Description,
      "Description2": this.promotionDetail.Description2,
      "Image": this.promotionDetail.Image,
      "HawkerCenterId": this.promotionDetail.HawkerCenterId,
      "Status": 'expired',
      // "Image": JSON.stringify(this.promotionDetail.Image),
    }
    this.TodayTime = moment().format();//String
    this.EndTime = moment(expirePromInfo['EndTime']).format() //String

    // console.log(this.TodayTime);
    // console.log(this.EndTime);
     let tokenNo = localStorage.getItem("Token");
     let editExpireUrl = global.host + "updatecode" + "?token=" + tokenNo;
    // const editExpireUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/updatecode/?token=${localStorage.getItem("Token")}`;
    
    if(this.TodayTime > this.EndTime){
      this.http.put(editExpireUrl, expirePromInfo, {}).map(res => res.json()).subscribe(data => {
        // console.log(data);
      })
    }
  }

  updatePromotion(){
    let timeZoneDifference = (new Date()).getTimezoneOffset();
    let endDateMoment = moment(this.promotionDetail.EndTime).toISOString();
    let startDateMoment = moment(this.promotionDetail.StartTime).toISOString();

    const promInfo = {
      "Id":  this.promotionDetail.Id,
      "Code": this.promotionDetail.Code,
      "StartTime": startDateMoment,
      "EndTime": endDateMoment,
      "Qty": this.promotionDetail.Qty,
      "MerchantId": this.promotionDetail.MerchantId,
      "IsPercent": this.promotionDetail.IsPercent,
      "IsJoint": this.promotionDetail.IsJoint,
      "IsSpecial": this.promotionDetail.IsSpecial,
      "AssignOnly": this.promotionDetail.AssignOnly,
      "MaxRedemptPerUser":this.promotionDetail.MaxRedemptPerUser,
      "Amount": this.promotionDetail.Amount,
      "MinUsed":  this.promotionDetail.MinUsed,
      "MaxDiscount": this.promotionDetail.MaxDiscount,
      "Title": this.promotionDetail.Title,
      "Description": this.promotionDetail.Description,
      "Description2": this.promotionDetail.Description2,
      "Image": this.promotionDetail.Image,
      "Status": this.promotionDetail.Status,
      "HawkerCenterId": this.promotionDetail.HawkerCenterId,
      // "Image": JSON.stringify(this.promotionDetail.Image),
    }
    this.promotionCodes = localStorage.getItem("EditingPromoCode");
    let assignPromotionCodes = JSON.parse(this.promotionCodes);
    this.Id = assignPromotionCodes["Id"];
     let tokenNo = localStorage.getItem("Token");
     let editUrl = global.host + "updatecode" + "?token=" + tokenNo;
    // const editUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/updatecode/?token=${localStorage.getItem("Token")}`;
    this.http.put(editUrl, promInfo, {}).map(res => res.json()).subscribe(data => {
      // console.log(data);
      if(data["Message"]==undefined){
        this.router.navigate(['/promotion']);
      }
      else{
        console.log(data["Message"]);
        this.router.navigate(['/promotion']);
      }
    }, error => {
      console.log(error);
    })
    // this.promotionService.addPromotion(this.promotionDetail);
  }
}


