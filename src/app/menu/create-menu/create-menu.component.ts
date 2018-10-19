import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Headers,URLSearchParams,RequestMethod,RequestOptions,RequestOptionsArgs,ResponseContentType,HttpModule,Http,Response } from "@angular/http";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { MenuView } from '../menu-view.model'
import { FormControl } from '@angular/forms/src/model';
import { global } from '../../global';

class OperationHour {
  OpenTime;
  CloseTime;

  constructor(inOpenTime = '08:00', inCloseTime: '22:00'){
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
  categoryLists: Array<any> = [];
  cuisineLists: Array<any> = [];
  hawkerCenterLists: Array<any> = [];
  statusLists = ['Not Verified', 'Openning', 'Shutted down', 'Suspended', 'Operating', 'Renovating']
  ReservationDropdownLists = [];
  ReservationSelectedItems = [];
  ReservationDropdownSettings = {};

  workingDays = [{WorkDays: 'Monday'}]

  constructor(private frmBuilder: FormBuilder,
              public http: Http,) { }

  ngOnInit() {
    this.ReservationDropdownLists = [
      {id:1, itemName: 'Xindots Booking System'},
      {id:2, itemName: 'Xindots Queuing System'},
      {id:3, itemName: 'Phone Reservation'}
    ]
    this.menuDetails.ReservationType = [
      {id:1, itemName: 'Xindots Booking System'}
    ]
    // this.ReservationSelectedItems = [
    //   {'ReservationType': 'Xindots Booking System'}
    // ]
    this.ReservationDropdownSettings = {
      text: 'Select Reservation Type',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    }

    this.menuDetails.OpenTiming = [{Name: 'Monday', ShortName: 'Mon', OperationHourList: [], ClosedToday: false},
                                   {Name: 'Tuesday', ShortName: 'Tue', OperationHourList: [], ClosedToday: false}]

    this.restaurant = this.frmBuilder.group({
      Name: ["", [Validators.required]],
      CoverPhoto: [""],
      ProfileImage: [""],
      ChineseName: [""],
      Details: [""],
      OtherInfo: [""],
      Tags: [""],
      Website: [""],
      PromotionDetails: [""],
      PricingRange: [""],
      PhoneNumber: [""],
      Address: [""],
      PostalCode: [""],
      Districts: [""],
      Zone: [""],
      Country: [""],
      HasPromotion: [false],
      Featured: [false],
      AvailableBooking: [false],
      IsPartner: [false],
      IsTakeaway: [false],
      HasQueue: [false],
      Verified: [false],
      IsRecommended: [false],
      Category: [""],
      Cuisine: [""],
      HawkerCenter: [""],
      RestaurantGroup: [""],
      RestaurantOwners: [""],
      Status: [""],
      ReservationType: [""],
    })

    let tokenNo = localStorage.getItem("Token");
    let getCategoriesUrl = global.host + "Categories" + "?token=" + tokenNo;
    let getCuisinesUrl = global.host + "Cuisines" + "?token=" + tokenNo;
    let getHawkerCenterUrl = global.host + "HawkerCenters" + "?token=" + tokenNo;
    //Get Category Name
    this.http.get(getCategoriesUrl, {}).map(res => res.json()).subscribe(data => {
      if(data["Message"]){
        console.log(data["Message"])
      }
      else{
        for(var i=0; i<data.length; i++){
          this.categoryLists.push(data[i]['Name'])
        }
      }
    })

    //Get Cuisine Name
    this.http.get(getCuisinesUrl, {}).map(res => res.json()).subscribe(data => {
      if(data["Message"]){
        console.log(data["Message"])
      }
      else{
        for(var i=0; i<data.length; i++){
          this.cuisineLists.push(data[i]["Name"])
        }
      }
    })

    //Get Hawker Center Name
    this.http.get(getHawkerCenterUrl, {}).map(res => res.json()).subscribe(data => {
      if(data["Message"]){
        console.log(data["Message"])
      }
      else{
        for(var i=0; i<data.length; i++){
          this.hawkerCenterLists.push(data[i]["Name"])
        }
      }
    })
  }

  onItemSelect(item: any){
    // console.log(item);
    // console.log(this.ReservationSelectedItems)
  }
  onItemDeSelect(item: any){
    // console.log(item);
    // console.log(this.ReservationSelectedItems)
  }
  onSelectAll(items: any){
    // console.log(items)
  }
  onDeSelectAll(items: any){
    // console.log(items)
  }

  get f(){
    return this.restaurant.controls;
  }

  createRestaurant(){
    // console.log('ok')
  }

}
