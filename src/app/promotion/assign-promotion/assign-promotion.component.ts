import { Component, OnInit, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { global } from "../../global";
import { NgModel, FormControl  } from "@angular/forms";
import { stringify } from "@angular/compiler/src/util";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct, NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
// import { PromotionCodeService } from "./promotion-code.service";
import { PromotionService } from "../promotion.service";
import { PromotionView } from "../promotion-view.model";
import { log } from "util";
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-promotion',
  templateUrl: './assign-promotion.component.html',
  styleUrls: ['./assign-promotion.component.scss']
})
export class AssignPromotionComponent implements OnInit {
  promotionDetail: PromotionView = new PromotionView();
  Id: Number;
  Special: Boolean;
  Status: String;
  promotionCodes:any;
  statusSelections = ["active", "deleted", "expired"];
  Message: String;
  Subject: String;

   //Expired checking
   public EndTime: String;
   EndTimeArr: Array<any> = [];
   public TodayTime: String;


  //Toggle for show
  show: Boolean = false;
  buttonName: any ="Assign to Merchant";

  //Search
  //  public MobilenNumber: String;
  //  public UserName: String;
   public userInput: String;
   public selectedSearchUser: Boolean;
   public codeAssign: String;
   public modeluser: String;
   public selectUser: Array<any>=[];
   public toggles = [{value: 'toggled', display: 'Toggled'},
                     {value: 'untoggled', display: 'Untoggled'},]
  //  public users: object =[{Id: 0, Name: "", Address: "", PhoneNumber: 0, toggle: this.toggles[1].value}];
  public users: Array<any>=[];

  //Assign Promotion Code
  public checkPromoCode: String;
  public checkPromoCodeId: Number;
  public UserId: Number;
  assignUserPromoCode: any;
  public promoCodeQty: number;

  constructor( public http: Http,
               private router: Router,
               public route: ActivatedRoute,
               private promotionService: PromotionService) { }

  ngOnInit() {
    this.promotionCodes = localStorage.getItem("assignPromoCode");
    let assignPromotionCodes = JSON.parse(this.promotionCodes);
    // console.log(assignPromotionCodes);
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
    this.expireCheck();
  }

  onKeydown(event){
    this.searchUser();
    // console.log(event);
  }

  searchUser(){
    let tokenNo = localStorage.getItem("Token");
    let userInput = this.userInput;
    let searchUrl = global.host + 'search/' + 'user/' + '?keyword=' + userInput + '&token=' + tokenNo;
    (!userInput)?
    window.alert('Search can not be empty'):
    this.http.get(searchUrl, {}).map(res => res.json()).subscribe(data => {
      if(data.length > 0){
        this.users = data;
        this.UserId = data[0]["Id"];
      }
      if(data.length == 0) {
        window.alert("User is not existing!");
      }
    })
  }

  assignPromotionCode(){
    //Check Promotion Code is Valid
    this.checkPromoCode = JSON.parse(this.promotionCodes).Code;
    let assignPromCode = this.checkPromoCode;
    let assignPromCodeId = this.checkPromoCodeId;
    let tokenNo = localStorage.getItem("Token");
    let assignPromUrl = global.host + "promocodes" + "?token=" +tokenNo;
    this.http.get(assignPromUrl, {}).map(res => res.json()).subscribe(data =>{
      for(var i=0; i<data.length; i++){
        if(assignPromCodeId = data[i]["Id"]){
          let UserId = this.UserId;
          this.Special = data[i]['IsSpecial'];
          this.promoCodeQty = data[i]['Qty'];
          this.assignUserPromoCode = {
            "Id": data[i]["Id"],
            "Code": data[i]["Code"],
            "StartTime": data[i]["StartTime"],
            "EndTime": data[i]["EndTime"],
            "Qty": data[i]["Qty"],
            "MerchantId":data[i]["MerchantId"],
            "IsPercent": data[i]["IsPercent"],
            "IsJoint": data[i]["IsJoint"],
            "IsSpecial": data[i]["IsSpecial"],
            "AssignOnly": data[i]["AssignOnly"],
            "_maxRedempt": 0,
            "Amount": data[i]["Amount"],
            "MinUsed": data[i]["MinUsed"],
            "MaxDiscount": data[i]["MaxDiscount"],
            "Title": data[i]["Title"],
            "Description": data[i]["Description"],
            "Status": data[i]["Status"],
            "CreatedByUserId": data[i]["CreatedByUsedId"],
            "DeleteByUserId": data[i]["DeleteByUseId"],
            "UserId": this.UserId,
            "Message": this.Message,
            "Subject": this.Subject
          }
        }
      }
      let tokenNo = localStorage.getItem("Token");
      let assignPromoCodeUrl = global.host + 'promocodes/' + '?token=' + tokenNo;
      //Assign Promo Code
      if(this.Special == true){
        Swal({
          position: 'center',
          type: 'info',
          title: 'The Special Promotion Code is not allowed to assign customer',
          showConfirmButton: true,
        }).then(()=>{
          this.router.navigate(['/promotion/']);
        })
      }
      else{
        //Check promo code balance
        if(this.promoCodeQty > 0){
          this.http.post(assignPromoCodeUrl, this.assignUserPromoCode, {}).map(res => res.json()).subscribe(data => {
            console.log(data);
            if(data["Message"] == undefined){
              // window.alert("Assign Successfully")
              Swal({
                position:'center',
                type:'success',
                title: 'Assign Successfully',
                showConfirmButton: false,
                timer: 1500
              }).then(()=>{
                this.router.navigate(['/promotion']);
              })
            }
            else{
              console.log(data["Message"]);
            }
          }, error=>{
            console.log(error);
          })
        }
        else {
          Swal({
            position:'center',
            type:'warning',
            title: '-----Unable Assign to User-----(The quantity of current promotion code is 0)',
            showConfirmButton: true,
          })
        }
      }
      
    })
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
      "AssignOnly": this.promotionDetail.AssignOnly,
      "MaxRedemptPerUser":this.promotionDetail.MaxRedemptPerUser,
      "Amount": this.promotionDetail.Amount,
      "MinUsed":  this.promotionDetail.MinUsed,
      "MaxDiscount": this.promotionDetail.MaxDiscount,
      "Title": this.promotionDetail.Title,
      "Description": this.promotionDetail.Description,
      "Description2": this.promotionDetail.Description2,
      "Status": 'expired',
    }
    this.TodayTime = moment().format();//String
    this.EndTime = moment(expirePromInfo['EndTime']).format() //String
    let tokenNo = localStorage.getItem("Token");
    let editExpireUrl = global.host + "updatecode" + "?token=" + tokenNo;
    // const editExpireUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/updatecode/?token=${localStorage.getItem("Token")}`;
    if(this.TodayTime > this.EndTime){
      this.http.put(editExpireUrl, expirePromInfo, {}).map(res => res.json()).subscribe(data => {
        // console.log(data);
      })
    }
  }
}
