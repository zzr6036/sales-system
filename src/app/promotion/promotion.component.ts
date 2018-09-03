import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, Response } from '@angular/http';
import { global } from '../global';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http/src/base_request_options';
import { OrderModule, OrderPipe } from 'ngx-order-pipe';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { TruncatePipe } from 'angular-pipes';
import { PromotionService } from './promotion.service';
import { PromotionView } from './promotion-view.model';
import { PromotionEditComponent } from './promotion-edit/promotion-edit.component';
import { AssignPromotionComponent } from './assign-promotion/assign-promotion.component';
import { AssignPromotionUsersComponent } from './assign-promotion-users/assign-promotion-users.component';


@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
  providers: [PromotionService, PromotionEditComponent]
})
export class PromotionComponent implements OnInit {

  promotionCodes:Array<any> = [];
  searchPromotionCodes: Array<any>=[];
  promotionDetail: PromotionView = new PromotionView();

  public code:String;
  public term: any;
  public Id: Number;
  public UserId: Number;
  public Status: String;
  deletePromotionCode: any;
  expireInfo: any;

  //Expired checking
  public EndTime: Date;
  EndTimeArr: Array<any> = [];


  //Sorting
  public order: String = 'index'; 
  public reverse: boolean = true;
  sortedCollection: any[];

  //Search
  public codeAssign: String;
  public modeluser: String;
  // public selectUser = [];
  public selectUser: Array<any>=[];
  public users: object =[
    { Id: 0, Name: "", Address: "", PhoneNumber: 0}
  ]
  public selectedUser: String = "";
  public alert ={ class:"",message: ""};
  public Name: String;
  public MobileNumber: String;

  constructor(public http: Http, 
              route: ActivatedRoute, 
              private router: Router, 
              private promotionService: PromotionService,
              private promotionEditComponent: PromotionEditComponent,
              private orderPipe: OrderPipe){
                this.sortedCollection = orderPipe.transform(this.promotionCodes,'info.Code');
              }

  ngOnInit() {
    let roleName = localStorage.getItem('RoleName');
    if(roleName === 'Sales'){
      this.loadPromotionList();
      this.promotionEditComponent.expireCheck();
    }
    else{
      Swal({
        position: 'center',
        type: 'warning',
        title: 'You are not allowed to load Promotion Page!',
        showConfirmButton: false,
        timer: 2500
      }).then(()=>{
        this.router.navigate(['/promotion/']);
      })
    }
  }

  createNewPromotion(){
    let roleName = localStorage.getItem("RoleName");
    if (roleName === "Sales"){
      this.router.navigate(['/promotion/promotion-code']);
    }
    else{
      Swal({
        position: 'center',
        type: 'warning',
        title: 'You are not allowed to create new promotion code!',
        showConfirmButton: true,
        // timer: 2500
      }).then(()=>{
        this.router.navigate(['/promotion/']);
      })
    }
  }

  setOrder(value: string){
    if(this.order === value){
      this.reverse = !this.reverse
    }
    this.order = value;
  }

  viewDetail(promoCode){
    localStorage.setItem("viewPromoCode", JSON.stringify(promoCode));
    let roleName = localStorage.getItem("RoleName");
    if(roleName === 'Sales'){
      this.router.navigate(['promotion/promotion-userlist/' + promoCode.Id]);
    }
    else{
      Swal({
        position: 'center',
        type: 'warning',
        title: 'You are not allowed to view promotion code usage list!',
        showConfirmButton: true,
        // timer: 2500
      }).then(()=>{
        this.router.navigate(['/promotion/']);
      })
    }
  }

  editPromCode(promoCode){
    localStorage.setItem("EditingPromoCode", JSON.stringify(promoCode));
    let roleName = localStorage.getItem("RoleName");
    if(roleName === 'Sales'){
      this.router.navigate(['promotion/promotion-edit/' + promoCode.Id]);
    }
    else{
      Swal({
        position: 'center',
        type: 'warning',
        title: 'You are not allowed to edit promotion code!',
        showConfirmButton: true,
        // timer: 2500
      }).then(()=>{
        this.router.navigate(['/promotion/']);
      })
    }
  }

  assignPromotion(promoCode){
    localStorage.setItem("assignPromoCode", JSON.stringify(promoCode));
    let roleName = localStorage.getItem("RoleName");
    if(roleName === 'Sales'){
      this.router.navigate(['promotion/assign-promotion/' + promoCode.Id]);
    }
    else{
      Swal({
        position: 'center',
        type: 'warning',
        title: 'You are not allowed to assign promotion code to customers!',
        showConfirmButton: true,
        // timer: 2500
      }).then(()=>{
        this.router.navigate(['/promotion/']);
      })
    }
  }

  assignPromotionToAll(promoCode){
    localStorage.setItem("assignPromoCodeAll", JSON.stringify(promoCode));
    let roleName = localStorage.getItem("RoleName");
    if(roleName === 'Sales'){
      this.router.navigate(['promotion/assign-promotion-users/' + promoCode.Id]);
    }
  }

  loadPromotionList(){
    this.promotionService.getPromotionList().subscribe(data =>{
      if(data["Message"]){
        console.log(data["Message"]);
      }
      else{
        this.promotionCodes = data;
        // console.log(data)
      }
    }, error => {
      console.log(error);
    })
  }

  loadPromotionCodeList(){
     let tokenNo = localStorage.getItem("Token");
     let mobileNo = this.MobileNumber;
     let getResUrl = global.host + "search" + "user" + "?keyword=" + mobileNo + "&token="+ tokenNo;
    // let getResUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/search/user/?keyword=${this.MobileNumber}&token=${localStorage.getItem("Token")}`;
    this.http.get(getResUrl, {}).map(res => res.json()).subscribe(data => {
      // console.log(data);
      if(data['Message']){
        console.log(data["Message"]);
      }
      else{
        this.searchPromotionCodes = data;
      }
    }, error =>{
      console.log(error);
    });

  }

  //Search promotion code
  checkbox(e){
    this.selectUser.push(e);
    console.log(this.selectUser)
  }

  // searchUser(){
  //   // console.log(this.selectUser);
  //   let tokenNo = localStorage.getItem("Token");
  //    let mobileNo = this.MobileNumber;
  //    let getResUrl = global.host + "search" + "user" + "?keyword=" + mobileNo + "&token="+ tokenNo;

  //   (!this.modeluser)?
  //   this.alert={class:"alert-danger", message:"Search can not be empty"}:
  //   this.http.get(`http://xindotsbackend.azurewebsites.net/_xin/api/search/user/?keyword=${this.modeluser}&token=${localStorage.getItem("Token")}`).
  //   map(res => res.json()).subscribe(data => {
  //     // console.log(data);
  //     this.users = data;
  //     // console.log(this.users);

  //     if(!true){
  //       this.alert ={
  //         class: "alert-danger",
  //         message:"Server error, please try again"
  //       };
  //     }
  //   }), error => {
  //     console.log(error);
  //   }
  // }
  
  //Unused, to be update
  // assignCode(){
  //   // console.log(this.codeAssign);
  //   let tokenNo = localStorage.getItem("Token");
  //    let mobileNo = this.MobileNumber;
  //    let codeAssignNo = this.codeAssign;
  //    let getPromUrl = global.host + "promocode" + "?promocode=" + codeAssignNo;

  //   // let getPromUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/promocode/?promocode=${this.codeAssign}`;
  //   this.http.get(getPromUrl, {}).map(res => res.json()).subscribe(data =>{
  //     // console.log(data);
  //     // console.log(data["Code"]);
  //     let promCodeAssign = data["Code"];
  //     let UserId = this.UserId;
  //     // console.log(UserId);

  //     const userPromCode ={
  //       "Id": data["Id"],
  //       "Code": data["Code"],
  //       "StartTime": data["StartTime"],
  //       "EndTime": data["EndTime"],
  //       "Qty": data["Qty"],
  //       "MerchantId": data["MerchantId"],
  //       "IsPercent": data["IsPercent"],
  //       "IsJoint": data["IsJoint"],
  //       "IsSpecial": data["IsSpecial"],
  //       "MaxRedemptPerUser": data["MaxRedemptPerUser"],
  //       "Amount": data["Amount"],
  //       "MinUsed": data["MinUsed"],
  //       "MaxDiscount": data["MaxDiscount"],
  //       "Title": data["Title"],
  //       "Description": data["Description"],
  //       "Description2": data["Description2"],
  //       "Status": data["Status"],
  //       "CreatedByUserId": data["CreatedByUserId"],
  //       "DeleteByUser": data["DeleteByUser"],
  //       "UserId": UserId,
  //     }
  //     let tokenNo = localStorage.getItem("Token");
  //     let postUserUrl = global.host + "promocodes" + "?token=" + tokenNo;

  //     // let postUserUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/promocodes/?token=${localStorage.getItem('Token')}`;
  //     this.http.post(postUserUrl, userPromCode, {}).map(res => res.json()).subscribe(data => {
  //       // console.log(data);
  //       if(data["Message"] == undefined ){
  //         console.log(data["Message"]);
  //         this.router.navigate(['/promotion']);
  //       }
  //       else{
  //         console.log(data["Message"]);
  //       }
  //     }, error=>{
  //       console.log(error);
  //     })
  //   })

    

  // }
}


