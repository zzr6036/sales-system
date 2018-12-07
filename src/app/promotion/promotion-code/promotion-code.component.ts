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
import { Md5 } from "ts-md5/dist/md5";
import Swal from "sweetalert2";
import { window } from "rxjs/operators/window";

@Component({
  selector: "app-promotion-code",
  templateUrl: "./promotion-code.component.html",
  styleUrls: ["./promotion-code.component.scss"]
})
export class PromotionCodeComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  Id: Number;
  promocodeInfoes: any;
  //HawkerCenters
  HawkerCenterSelected = [];
  HawkerCenterLists = [];
  //search merchant Id function
  merchantName: String;
  merchantSearchItems: Array<any> = [];
  merchantSelected = [];
  searchSelectedMerchantInfo: Array<any> = [];

  //Toggle for show
  show: Boolean = false;
  buttonName: any ="Assign to Merchant";

  //Variable for verification
  promInfoStartTime: Date;
  promInfoEndTime: Date;
  promInfoCode: Number;
  StartTimeArr: Array<any> = [];
  EndTimeArr: Array<any> = [];
  CodeArr: Array<any> = [];
  //upload image
  loaded = false;

  constructor(
    public http: Http,
    private router: Router,
    public route: ActivatedRoute,
    private promotionService: PromotionService
  ) {}

  ngOnInit() {
    this.searchHawerCenter();
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

  addPromotion(){
    let tokenNo = localStorage.getItem("Token");
    let addPromoCodeUrl = global.host + "addcode" + "?token=" + tokenNo;
    let timeZoneDifference = (new Date()).getTimezoneOffset();
    // let endDateMoment = moment(this.promotionDetail.EndTime).toISOString();
    // let startDateMoment = moment(this.promotionDetail.StartTime).toISOString();
    let endDateMoment = moment((this.promotionDetail.EndTime).toString()).subtract(8,'hours').format('YYYY-MM-DDTHH:mm:ss');
    let startDateMoment = moment((this.promotionDetail.StartTime).toString()).subtract(8,'hours').format('YYYY-MM-DDTHH:mm:ss');

    this.promocodeInfoes = {
      Id: this.promotionDetail.Id,
      Code: this.promotionDetail.Code,
      StartTime: startDateMoment,
      // EndTime: this.promotionDetail.EndTime,
      EndTime: endDateMoment,
      Qty: this.promotionDetail.Qty,
      MerchantId: this.promotionDetail.MerchantId,
      IsPercent: this.promotionDetail.IsPercent,
      IsJoint: this.promotionDetail.IsJoint,
      AssignOnly: this.promotionDetail.AssignOnly,
      IsSpecial: this.promotionDetail.IsSpecial,
      MaxRedemptPerUser: this.promotionDetail.MaxRedemptPerUser,
      Amount: this.promotionDetail.Amount,
      MinUsed: this.promotionDetail.MinUsed,
      MaxDiscount: this.promotionDetail.MaxDiscount,
      Title: this.promotionDetail.Title,
      Description: this.promotionDetail.Description,
      Description2: this.promotionDetail.Description2,
      Image: this.promotionDetail.Image,
      HawkerCenterId: this.promotionDetail.HawkerCenterId,
    }
    // console.log(this.promocodeInfoes);
    this.http.post(addPromoCodeUrl, this.promocodeInfoes, {}).map(res => res.json()).subscribe(promocodeDatas =>{
      // console.log(promocodeDatas)
      if(promocodeDatas['Message']==undefined){
        Swal({
          position: 'center',
          type: 'success',
          title: 'New Promocode Upload Successfully',
          showConfirmButton: false, 
          timer: 2000,
        }).then(() =>{
          this.router.navigate(['/promotion'])
        })
      }
      else {
        console.log(promocodeDatas['Message']);
        alert(promocodeDatas['Message']);
      }
    }, error =>{
      console.log(error)
    })
  }
}
