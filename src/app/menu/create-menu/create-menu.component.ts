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
  selector: 'app-create-menu',
  templateUrl: './create-menu.component.html',
  styleUrls: ['./create-menu.component.scss']
})
export class CreateMenuComponent implements OnInit {
  menuDetails: MenuView = new MenuView();
  restaurant: FormGroup;
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

    // this.menuDetails.OpenTiming = [{Name: 'Monday', ShortName: 'Mon', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Tuesday', ShortName: 'Tue', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Wednesday', ShortName: 'Wed', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Thursday', ShortName: 'Thur', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Friday', ShortName: 'Fri', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Saturday', ShortName: 'Sat', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Sunday', ShortName: 'Sun', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Eve Of Public Holiday', ShortName: 'EveOfP.H', OperationHourList: [], ClosedToday: false},
    //                                {Name: 'Public Holiday', ShortName: 'P.H', OperationHourList: [], ClosedToday: false}]

    this.restaurant = this.frmBuilder.group({
      // CoverPhoto: [""],
      CoverPhoto: [this.menuDetails.CoverPhoto],
      // UserName: [null, Validators.compose([Validators.required])],
      UserName: ["", [Validators.required]],
      Password: ["", [Validators.required]],
      Email: [""],
      Mobile: [""],
      RestaurantName: [""],
      BusinessLegalName: [""],
      Country: [""],
      PostalCode: [""],
      RegisteredAddress: [""],
      LegalEntityType: [""],
      OpenTime: [""],
      CloseTime: [""],
      ClosedToday: [false],
      ConvertToOnboarding: [false]
    })
  }

  _handleReaderLoaded(readerEvt) {
    var reader = readerEvt.target;
    this.menuDetails.CoverPhoto = reader.result;
    this.loaded = true;
    // var binaryString = readerEvt.target.result;
    // // this.base64textString = btoa(binaryString);
    // this.menuDetails.CoverPhoto = btoa(binaryString);
    // console.log(btoa(binaryString))
    // // this.menuDetails.CoverPhoto = binaryString;
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
    // var files = evt.target.files;
    // var file = files[0];
    // if(files && file){
    //   var reader = new FileReader();
    //   reader.onload = this._handleReaderLoaded.bind(this);
    //   reader.readAsBinaryString(file)
    // }
  }
 

  initOperationList(){
    
    // this.menuDetails.OpenTiming = []
    // let isOperationListStringValid = this.isJsonString(this.menuDetails.OpenTiming)
    // for(var i=0; i<this.menuDetails.OpenTiming.length; i++){
    //   this.operationListJson.push(this.menuDetails.OpenTiming[i].Name)
    // }
    // for(let operationData of this.operationListJson){
    //   let operationHourList = [];
    //   for( let operationHourData of operationData){
    //     operationHourList.push(new OperationHour(operationHourData.OenTime, operationHourData.CloseTime))
    //   }
    //   this.menuDetails.OpenTiming.push(new OperationItem(operationData.Name, operationData.ShortName, operationHourList,operationData.ClosedToday));
    // }
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
  editOperation(){
    this.editOperationList = []
    for(let operationData of this.menuDetails.OpenTiming){
      let copyOpTimeList = []
      for(let operationTime of operationData.OperationHourList){
        let copyOpTime = new OperationHour(operationTime.OpenTime, operationTime.CloseTime)
        copyOpTimeList.push(copyOpTime)
      }
      this.editOperationList.push(new OperationItem(operationData.Name, operationData.ShortName, copyOpTimeList, operationData.ClosedToday))
    }
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

  // addOperationTime(inDayIdx, inOpTimeIdx){
  //   let operationHourItem: any;
  //   for(let operationData of this.menuDetails.OpenTiming[inDayIdx]){
  //     operationHourItem.push(new OperationHour(operationData.OpenTime, operationData.CloseTime))
  //     // operationHourItem.push(new OperationHour(operationTime[inOpTimeIdx].OpenTime, operationTime[inOpTimeIdx].CloseTime))
  //   }
  //   this.menuDetails.OpenTiming[inDayIdx].OperationHourList.push(operationHourItem)
  //   // operationHourItem = {}
  //   // this.menuDetails.OpenTiming[inDayIdx].OperationHourList.push(new OperationHour())
  //   console.log(this.menuDetails.OpenTiming[0].OperationHourList)
  //   console.log(this.menuDetails.OpenTiming)
  // }

  

  addOperationTime(inDayIdx, inOpTimeIdx){
    let operationHourItem: any;
    for(let operationData of this.menuDetails.OpenTiming[inDayIdx].OperationHourList){
      operationHourItem = new OperationHour(operationData.OpenTime, operationData.CloseTime)
    }
    this.menuDetails.OpenTiming[inDayIdx].OperationHourList.push(operationHourItem)
    console.log(this.menuDetails.OpenTiming)
  }


  // addOperationTime(inDayIdx, inOpTimeIdx){
  //   let env = this;
  //   let operationOpenTime: any;
  //   let operationCloseTime: any;
  //   let copyOpTimeList = []
  //   this.editOperationList = [];
  //   let operationData: any
  //   let operationTime: any;
  //   let operationTimeItem: any;
  //   for (operationData of this.menuDetails.OpenTiming){
  //     for(let operationTime of operationData.OperationHourList){
  //       operationTimeItem = new OperationHour(operationTime.OpenTime, operationTime.CloseTime)
  //       copyOpTimeList.push(operationTimeItem)
  //     }
  //     // this.editOperationList.push(new OperationItem(operationData.Name, operationData.ShortName, copyOpTimeList, operationData.ClosedToday))
  //   }
  //   // this.editOperationList.push(new OperationItem(operationData.Name, operationData.ShortName, copyOpTimeList, operationData.ClosedToday))
  //   // console.log(copyOpTimeList)
  //   // this.menuDetails.OpenTiming[inDayIdx].operationHourList.push(copyOpTimeList)
  //   console.log(this.editOperationList)
  // }

  // addOperationTime(inDayIdx, inOpTimeIdx) {
  //   let operationItem = {OpenTime: '09:00', CloseTime: '05:00'}
  //   this.menuDetails.OpenTiming[0].OperationHourList.push(operationItem)
  //   // for(var n=0; n<this.menuDetails.OpenTiming.length; n++){
  //   //   let operationData = this.menuDetails.OpenTiming[n].OperationHourList;
  //   //   console.log(operationData)
  //   // }
  // }

  removeOperationTime(inDayIdx, inOpTimeIdx){
    this.menuDetails.OpenTiming[inDayIdx].OperationHourList.splice(inOpTimeIdx, 1)
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
        this.existingMerchants.push(merchantInfoe.UserName)
      }
      // for (let username of this.existingMerchants){
      //   if(this.menuDetails.UserName == username){
      //     alert("Existing username, please change a new username!")
      //   }
      // }
      console.log(this.existingMerchants)
    })
  }

  createRestaurant(){
    let token = localStorage.getItem("Token");
    let postOnlineMerchantUrl = global.host + "merchantinfoes" + "?token=" + token;
    if(this.restaurant.valid){
      //No tick the convert to online merchant checkbox
    if(!this.menuDetails.ConvertToOnboarding){
      this.offlineMerchantInfoes = {
        Id: this.menuDetails.Id,
        CoverPhoto: this.menuDetails.CoverPhoto,
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
      }
      console.log(this.offlineMerchantInfoes)
      //to do, post to offline merchant api
    }
    //Tick the convert to online merchant checkbox
    else {
      this.onlineMerchantInfoes = {
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
        Status: 'draft',
      }
      console.log(this.onlineMerchantInfoes)

      // for(var i=0; i<this.existingMerchants.length; i++){
        if(this.existingMerchants.includes((this.menuDetails.UserName).toString())){
          window.alert('Existing username, please change a new username.')
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
      // }
    }
    }
  }
}
