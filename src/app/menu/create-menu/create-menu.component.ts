import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Headers,URLSearchParams,RequestMethod,RequestOptions,RequestOptionsArgs,ResponseContentType,HttpModule,Http,Response } from "@angular/http";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { ChangeDetectorRef } from '@angular/core'
import { MenuView } from '../menu-view.model'
import { FormControl } from '@angular/forms/src/model';
import { global } from '../../global';

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
  merchantInfoes: Array<any> = [];
  operationListJson: Array<any> = [];
  
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
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
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
      CoverPhoto: [""],
      UserName: ["", [Validators.required]],
      Password: [""],
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
      ClosedToday: [false]
    })
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
  editOperationList(){
    this.menuDetails.OpenTiming = [];
    for(let operationData of this.menuDetails.OpenTiming){
      let operationHourList = [];
      for(let operationTime of operationData.OperationHourList){
        operationHourList.push(new OperationHour(operationTime.OpenTime, operationTime.CloseTime))
      }
      this.menuDetails.OpenTiming.push(new OperationItem(operationData.Name, operationData.ShortName, operationData.operationHourList, operationData.ClosedToday))
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
  addOperationTime(inDayIdx, inOpTimeIdx){
    let operationHourItem: any;
    for(let operationTime of this.menuDetails.OpenTiming[inDayIdx]){
      operationHourItem.push(new OperationHour(operationTime.OpenTime, operationTime.CloseTime))
    }
    this.menuDetails.OpenTiming[inDayIdx].OperationHourList.push(operationHourItem)
    // operationHourItem = {}
    // this.menuDetails.OpenTiming[inDayIdx].OperationHourList.push(new OperationHour())
    console.log(this.menuDetails.OpenTiming)
  }
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

  createRestaurant(){
    // console.log('ok')
  }

}
