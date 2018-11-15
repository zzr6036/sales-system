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

  constructor(inOpenTime = '08:00', inCloseTime  = '22:00'){
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
  selector: 'app-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})
export class EditMenuComponent implements OnInit {
  menuDetails: MenuView = new MenuView();
  restaurant: FormGroup;
  mobilePattern = "^[+][5-6]{2}[-][0-9]{8}";
  offlineMerchantInfoes: any;
  onlineMerchantInfoes: any;
  operationListJson: Array<any> = [];
  operationList: any;
  editOperationList: Array<any> = [];
  editMerchantInfoes: any;
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
    this.editMerchantInfoes = localStorage.getItem('OfflineMerchantInfoes');
    let assignMerchantInfoes = JSON.parse(this.editMerchantInfoes);
    this.menuDetails.Id = assignMerchantInfoes['Id'];
    this.menuDetails.CoverPhoto = assignMerchantInfoes['OutletPhoto'];
    this.menuDetails.UserName = assignMerchantInfoes['UserName'];
    this.menuDetails.Password = assignMerchantInfoes['Password'];
    this.menuDetails.Email = assignMerchantInfoes['Email'];
    this.menuDetails.Mobile = assignMerchantInfoes['Mobile'];
    this.menuDetails.RestaurantName = assignMerchantInfoes['RestaurantName'];
    this.menuDetails.BusinessLegalName = assignMerchantInfoes['BusinessLegalName'];
    this.menuDetails.Country = assignMerchantInfoes['Country'];
    this.menuDetails.PostalCode = assignMerchantInfoes['PostalCode'];
    this.menuDetails.RegisteredAddress = assignMerchantInfoes['RegisteredAddress'];
    this.menuDetails.OpenTiming = JSON.parse(assignMerchantInfoes['OpenTiming']);

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
      CoverPhoto: [""],
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
      Mobile: ["", Validators.pattern(this.mobilePattern)],
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
      // ConverToOnboarding: [false],
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
    this.menuDetails.OpenTiming[inDayIdx].OperationHourList.push(new OperationHour("08:00", "22:00"));
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
    if(this.menuDetails.UserName != undefined && this.menuDetails.Password != undefined && this.menuDetails.Mobile != undefined){
      //No tick the convert to online merchant checkbox, now online = offline onboard
    if(!this.menuDetails.ConverToOnboarding){
      this.offlineMerchantInfoes = {
        Id: this.menuDetails.Id,
        OutletPhoto: this.menuDetails.CoverPhoto,
        UserName: this.menuDetails.UserName,
        Password: this.menuDetails.Password,
        Email: this.menuDetails.Email,
        Mobile: this.menuDetails.Mobile,
        RestaurantName: this.menuDetails.RestaurantName,
        BusinessLegalName: this.menuDetails.BusinessLegalName,
        Country: this.menuDetails.Country,
        PostalCode: this.menuDetails.PostalCode,
        RegisteredAddress: this.menuDetails.RegisteredAddress,
        LegalEntityType: this.menuDetails.LegalEntityType,
        OpenTiming: JSON.stringify(this.menuDetails.OpenTiming),
        Status: 'offline',
      }
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
    //Tick the convert to online merchant checkbox, now online = offline onboard
    else {
      this.onlineMerchantInfoes = {
        Id: this.menuDetails.Id,
        OutletPhoto: this.menuDetails.CoverPhoto,
        UserName: this.menuDetails.UserName,
        Password: this.menuDetails.Password,
        Email: this.menuDetails.Email,
        Mobile: this.menuDetails.Mobile,
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
          this.http.post(postOnlineMerchantUrl, this.onlineMerchantInfoes, {}).map(res => res.json()).subscribe(data =>{
            // console.log(data)
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
  }

}
