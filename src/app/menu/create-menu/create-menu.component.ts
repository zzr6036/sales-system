import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Headers,URLSearchParams,RequestMethod,RequestOptions,RequestOptionsArgs,ResponseContentType,HttpModule,Http,Response } from "@angular/http";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { Router, ActivatedRoute } from "@angular/router";
import { MenuView } from '../menu-view.model'
import { FormControl } from '@angular/forms/src/model';
import { global } from '../../global';
import Swal from 'sweetalert2';

class OperationHour {
  OpenTime;
  CloseTime;

  constructor(inOpenTime = '11:00', inCloseTime  = '14:00'){
    this.OpenTime = inOpenTime;
    this.CloseTime = inCloseTime;
  }
}

class OperationItem {
  Name;
  ShortName;
  OperationHourList;
  ClosedToday;

  constructor(inName = 'Monday', inShortName = 'Mon', inOperationHourList = [], inClosedToday = false){
    this.Name = inName;
    this.ShortName = inShortName;
    this.OperationHourList = inOperationHourList;
    this.ClosedToday = inClosedToday;
  }
}

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss']
})
export class CreateMenuComponent implements OnInit {
  menuDetails: MenuView = new MenuView();
  restaurant: FormGroup;
  mobilePattern = "^[0-9]{8}";
  offlineMerchantInfoes: any;
  onlineMerchantInfoes: any;
  operationListJson: Array<any> = [];
  operationList: any;
  editOperationList: Array<any> = [];
  //upload image
  loaded = false;
  base64textString: String = "";
  existingMerchants: Array<any> = [];
  LegalEntityTypes = ["NEA Hawker",
                      "Limited Liability Company",
                      "Private Limited Company",
                      "Public Limited Company",
                      "Public Company Limited by Guarantee",
                      "Foreign Company Registration",
                      "Sole Proprietorship",
                      "General Partnership",
                      "Limited Liability Partnership (LLP)"];
  // categoryLists: Array<any> = [];
  // cuisineLists: Array<any> = [];
  // hawkerCenterLists: Array<any> = [];

  // ReservationDropdownLists = [];
  // ReservationSelectedItems = [];
  // ReservationDropdownSettings = {};

  constructor(private frmBuilder: FormBuilder,
              public http: Http,
              private cdRef: ChangeDetectorRef,
              private router: Router,) { }

  ngOnInit() {
    // this.menuDetails.MobileFormat = "+65-";
    this.checkDuplicateUserName()
    this.initOperationList();
    // this.editOperationList();
    let tokenNo = localStorage.getItem("Token");
    let getMerchantUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
    this.http.get(getMerchantUrl, {}).map(res => res.json()).subscribe(merchantInfoData =>{

    })
    // this.ReservationDropdownSettings = {
    //   text: 'Select Reservation Type',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   enableSearchFilter: true,
    //   classes: 'myclass custom-class'
    // }

    this.restaurant = this.frmBuilder.group({
      // CoverPhoto: [""],
      CoverPhoto: [""],
      // UserName: [null, Validators.compose([Validators.required])],
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
      Mobile: ["", Validators.pattern(this.mobilePattern)],
      MobileFormat: [""],
      Email: [""],
      RestaurantName: [""],
      BusinessLegalName: [""],
      Country: [""],
      PostalCode: [""],
      RegisteredAddress: [""],
      LegalEntityType: [""],
      // OpenTime: [""],
      // CloseTime: [""],
      // ClosedToday: [false],
      // ConverToOnboarding: [false]
    })
  }

  _handleReaderLoaded(readerEvt) {
    var reader = readerEvt.target;
    this.menuDetails.CoverPhoto = reader.result;
    this.loaded = true;
  }

  handleFileSelect(evt){
    var file = evt.dataTransfer ? evt.dataTransfer.files[0] : evt.target.files[0];
    if (file == undefined){
      this.menuDetails.CoverPhoto = undefined;
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if(!file.type.match(pattern)){
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
 

  initOperationList(){
    this.menuDetails.OpenTiming.push(new OperationItem('Monday', 'Mon', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Tuesday', 'Tue', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Wednesday', 'Wed', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Thursday', 'Thur', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Friday', 'Fri', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Saturday', 'Sat', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Sunday', 'Sun', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Eve Of Public Holiday', 'EveOfP.H', [new OperationHour()], false));
    this.menuDetails.OpenTiming.push(new OperationItem('Public Holiday', 'P.H', [new OperationHour()], false));
    // console.log(this.menuDetails.OpenTiming)
  }

  // onItemSelect(item: any){
  //   // console.log(this.ReservationSelectedItems)
  // }
  // onItemDeSelect(item: any){
  //   // console.log(this.ReservationSelectedItems)
  // }
  // onSelectAll(items: any){
  // }
  // onDeSelectAll(items: any){
  // }

  addOperationTime(inDayIdx, inOpTimeIdx){
    //let operationHourItem: any;
    // for(let operationData of this.menuDetails.OpenTiming[inDayIdx].OperationHourList){
    //   operationHourItem = new OperationHour(operationData.OpenTime, operationData.CloseTime)
    // }
    this.menuDetails.OpenTiming[inDayIdx].OperationHourList.push(new OperationHour("11:00", "14:00"));
    console.log(this.menuDetails.OpenTiming)
  }


  removeOperationTime(inDayIdx, inOpTimeIdx){
    this.menuDetails.OpenTiming[inDayIdx].OperationHourList.splice(inOpTimeIdx, 1)
  }

  openTimeChanged(event,dayIdx, i){
    if(event == ""){
      this.menuDetails.OpenTiming[dayIdx].OperationHourList[i].OpenTime = "00:00";
    }
    console.log(event);
  }

  closeTimeChanged(event,dayIdx, i){
    if(event == ""){
      this.menuDetails.OpenTiming[dayIdx].OperationHourList[i].CloseTime = "00:00";
    }
    console.log(event);
  }

  isJsonString(str) {
    try {
      JSON.parse(str);
    } 
    catch (e) {
      return false;
    }
    return true;
  }
  get f(){
    return this.restaurant.controls;
  }

  checkDuplicateUserName(){
    let token = localStorage.getItem("Token");
    let getOnlineMerchantUrl = global.host + "merchantinfoes" + "?token=" + token;
    this.http.get(getOnlineMerchantUrl, {}).map(res => res.json()).subscribe(merchantInfoes => {
      for (let merchantInfoe of merchantInfoes){
        this.existingMerchants.push((merchantInfoe.UserName).toUpperCase())
      }
      // console.log(this.existingMerchants)
    })
  }

  createRestaurant(){
    let token = localStorage.getItem("Token");
    let postOnlineMerchantUrl = global.host + "merchantinfoes" + "?token=" + token;
    let postOfflineMerchantUrl = global.host + "merchantinfoes" + "?token=" + token;
    
    if(!this.menuDetails.ConverToOnboarding){
      if(this.menuDetails.UserName != undefined && this.menuDetails.Password != undefined && this.menuDetails.PostalCode != undefined){
        this.offlineMerchantInfoes = {
          Id: this.menuDetails.Id,
          OutletPhoto: this.menuDetails.CoverPhoto,
          UserName: this.menuDetails.UserName,
          Password: this.menuDetails.Password,
          Email: this.menuDetails.Email,
          Mobile: '+65-'+this.menuDetails.Mobile,
          RestaurantName: this.menuDetails.RestaurantName,
          BusinessLegalName: this.menuDetails.BusinessLegalName,
          Country: this.menuDetails.Country,
          PostalCode: this.menuDetails.PostalCode,
          RegisteredAddress: this.menuDetails.RegisteredAddress,
          LegalEntityType: this.menuDetails.LegalEntityType,
          OpenTiming: JSON.stringify(this.menuDetails.OpenTiming),
          Status: 'offline',
        }
        if(this.existingMerchants.includes(((this.menuDetails.UserName).toUpperCase()).toString())){
          window.alert('Existing username, please change a new username.');
        }
        else {
          this.http.post(postOfflineMerchantUrl, this.offlineMerchantInfoes, {}).map(res => res.json()).subscribe(data => {
            if(data['Message']==undefined){
              Swal({
                position: 'center',
                type: 'success',
                title: 'Offline Onboarding Successfully',
                showConfirmButton: false, 
                timer: 2000,
              }).then(() =>{
                this.router.navigate(['/menu'])
              })
            }
            else {
              console.log(data['Message']);
              window.alert(data['Message']);
            }
          }, error => {
            console.log(error)
          })
        }
      }
      else {
        alert('All the * fields are required')
      }
    }
    else {
      if(this.menuDetails.UserName != undefined && this.menuDetails.Password != undefined && this.menuDetails.PostalCode != undefined && this.menuDetails.Mobile != undefined){
        this.onlineMerchantInfoes = {
          Id: this.menuDetails.Id,
          OutletPhoto: this.menuDetails.CoverPhoto,
          UserName: this.menuDetails.UserName,
          Password: this.menuDetails.Password,
          Email: this.menuDetails.Email,
          Mobile: '+65-'+this.menuDetails.Mobile,
          // Mobile: this.menuDetails.Mobile,
          RestaurantName: this.menuDetails.RestaurantName,
          BusinessLegalName: this.menuDetails.BusinessLegalName,
          Country: this.menuDetails.Country,
          PostalCode: this.menuDetails.PostalCode,
          RegisteredAddress: this.menuDetails.RegisteredAddress,
          LegalEntityType: this.menuDetails.LegalEntityType,
          OpenTiming: JSON.stringify(this.menuDetails.OpenTiming),
          Status: 'draft',
        }
        console.log(this.onlineMerchantInfoes)
          if(this.existingMerchants.includes(((this.menuDetails.UserName).toUpperCase()).toString())){
            window.alert('Existing username, please change a new username.');
          }
          else {
            this.http.post(postOnlineMerchantUrl, this.onlineMerchantInfoes, {}).map(res => res.json()).subscribe(data =>{
              console.log(data)
              if(data['Message']==undefined){
                Swal({
                  position: 'center',
                  type: 'success',
                  title: 'Convert to online merchant successfully',
                  showConfirmButton: false,
                  timer: 2000,
                }).then(() =>{
                  this.router.navigate(['/formes'])
                })
              }
              else {
                console.log(data['Message']);
                window.alert(data['Message'])
              }
            }, error =>{
              console.log(error)
            })
          }
      }
      else {
        alert('All the * fields are required')
      }
    }
  }
}