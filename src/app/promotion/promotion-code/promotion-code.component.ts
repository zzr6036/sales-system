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

@Component({
  selector: "app-promotion-code",
  templateUrl: "./promotion-code.component.html",
  styleUrls: ["./promotion-code.component.scss"]
})
export class PromotionCodeComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  Id: Number;
  promocodeInfoes: any;

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
  //HawkerCenters
  HawkerCenterSelected = [];
  HawkerCenterLists = [];

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
    console.log(this.promotionDetail.HawkerCenterId)
  }

  // onSelectFile(event){
  //   if(event.target.files && event.target.files[0]){
  //     var reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0]); // read file as data url
  //     reader.onload = (event) => {
  //       this.promotionDetail.Image = reader.result;
  //     }
  //   }
  // }

  _handleReaderLoaded(readerEvt) {
    var reader = readerEvt.target;
    this.promotionDetail.Image = reader.result;
    this.loaded = true;
  }
  handleFileSelect(evt){
    var file = evt.dataTransfer ? evt.dataTransfer.files[0]:evt.target.files[0];
    if (file == undefined){
      this.promotionDetail.Image = undefined
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if(!file.type.match(pattern)){
      window.alert("invaild format");
      return;
    }
    this.loaded = false;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  addPromotion(){
    // localStorage.setItem("PromoCode", this.promotionDetail.Code);
    // this.promotionService.addPromotion(this.promotionDetail);
    let tokenNo = localStorage.getItem("Token");
    let addPromoCodeUrl = global.host + "addcode" + "?token=" + tokenNo;
    this.promocodeInfoes = {
      Id: this.promotionDetail.Id,
      Code: this.promotionDetail.Code,
      StartTime: this.promotionDetail.StartTime,
      EndTime: this.promotionDetail.EndTime,
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
      Image: this.promotionDetail.Image
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
        window.alert(promocodeDatas['Message']);
      }
    }, error =>{
      console.log(error)
    })
  }
}
