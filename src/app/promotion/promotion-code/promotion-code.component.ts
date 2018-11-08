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

@Component({
  selector: "app-promotion-code",
  templateUrl: "./promotion-code.component.html",
  styleUrls: ["./promotion-code.component.scss"]
})
export class PromotionCodeComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  Id: Number;

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

  addPromotion(){
    // localStorage.setItem("PromoCode", this.promotionDetail.Code);
    this.promotionService.addPromotion(this.promotionDetail);
  }

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
}
