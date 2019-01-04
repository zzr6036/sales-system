import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, Response } from '@angular/http';
import { global } from '../../global';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http/src/base_request_options';
import { OrderModule, OrderPipe } from 'ngx-order-pipe';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { TruncatePipe } from 'angular-pipes';
import { PromotionService } from './../promotion.service';
import { PromotionView } from './../promotion-view.model';
import { PromotionEditComponent } from './../promotion-edit/promotion-edit.component';
import { AssignPromotionComponent } from './../assign-promotion/assign-promotion.component';
import { AssignPromotionUsersComponent } from './../assign-promotion-users/assign-promotion-users.component';

@Component({
  selector: 'app-active-promocode',
  templateUrl: './active-promocode.component.html',
  styleUrls: ['./active-promocode.component.scss'],
  providers: [PromotionService, PromotionEditComponent]
})
export class ActivePromocodeComponent implements OnInit {
  activePromocodeInfoes: Array<any> = [];
  promotionCodes: Array<any> = [];
  expiredPromotionCodes: Array<any> = [];
  searchPromotionCodes: Array<any>=[];
  promotionDetail: PromotionView = new PromotionView();

  // token & api url
  tokenNo = localStorage.getItem("Token");
  getPromocodesUrl = global.host + "promocodes" + "?token=" + this.tokenNo;

  public code:String;
  public term: any;
  public Id: Number;
  public UserId: Number;
  public Status: String;
  deletePromotionCode: any;
  expireInfo: any;
  currentDate: String;
  StartTime: String;

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
    // this.currentDate = moment().format('MM-DD-YYYY')
    this.currentDate = moment().format()

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

  assignPromitonByTimes(promoCode){
    localStorage.setItem("assignPromoCodeTimes", JSON.stringify(promoCode));
    let roleName = localStorage.getItem("RoleName");
    if(roleName === 'Sales'){
      this.router.navigate(['promotion/assign-promotion-times/' + promoCode.Id])
    }
  }


  loadPromotionList(){
    this.http.get(this.getPromocodesUrl, {}).map(res => res.json()).subscribe(activePromocode =>{
      // console.log(activePromocode)
      if(activePromocode['Message']){
        console.log(activePromocode['Message'])
        alert(activePromocode['Message'])
      }
      else{
        for(var i=0; i<activePromocode.length; i++){
            if((moment(activePromocode[i]["EndTime"]).add(8, 'hours').format('YYYY-MM-DDTHH:mm:ss')) >= this.currentDate){
              activePromocode[i]['StartTime'] =  moment(activePromocode[i]["StartTime"]).add(8, 'hours').format('YYYY-MM-DDTHH:mm:ss')
              activePromocode[i]['EndTime'] =  moment(activePromocode[i]["EndTime"]).add(8, 'hours').format('YYYY-MM-DDTHH:mm:ss')
              this.promotionCodes.push(activePromocode[i])
          }
        }
        // console.log(this.promotionCodes)
      }
    })
  }

  loadPromotionCodeList(){
    let tokenNo = localStorage.getItem("Token");
    let mobileNo = this.MobileNumber;
    let getResUrl = global.host + "search" + "user" + "?keyword=" + mobileNo + "&token="+ tokenNo;
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

  //Divide promocode into 3 different types
  allPromoCode(){
    this.router.navigate(['/promotion'])
  }

  activePromoCode(){
    this.router.navigate(['/promotion/active-promocode'])
  }

  expiryPromoCode(){
    this.router.navigate(['/promotion/expiry-promocode'])
  }

}
