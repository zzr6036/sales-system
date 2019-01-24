import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, Response } from '@angular/http';
import { global } from '../global';
import { Router, ActivatedRoute } from '@angular/router';
// import { window } from 'rxjs/operators/window';
import { Observable } from 'rxjs/Rx';
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment';
import { ExcelService } from '../services/excel.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  merchantInfoes: Array<any> = [];

  //Search
  public term: any;
  itemSelected: String;
  // selections = ["Id", "OutletName", "Mobile", "Email", "Status"];
  selections = ["Id", "OutletName", "Mobile", "Status"];
  idList: Array<any> = [];
  restaurantNameList: Array<any> = [];
  emailList: Array<any> = [];
  mobileNoList: Array<any> = [];
  statusList: Array<any> = [];
  FilterList: Array<any> = [];

  constructor(public http: Http, 
              route: ActivatedRoute, 
              private router: Router,
              private excelService: ExcelService,) { }

  ngOnInit() {
    this.router.navigate(['/menu/'])
    this.loadOfflineMerchant()
  }

  loadOfflineMerchant(){
    let token = localStorage.getItem("Token");
    let getOfflineMerchantUrl = global.host + "merchantinfoes" + "?token=" + token;
    this.http.get(getOfflineMerchantUrl, {}).map(res => res.json()).subscribe(datas => {
      // console.log(datas)
      if(datas['Message']){
        alert(datas['Message'])
        console.log(datas['Message']);
      }
      else {
        this.merchantInfoes = [];
        for(var i=0; i<datas.length; i++){
          if(datas[i].Status == 'offline'){
            this.merchantInfoes.push(datas[i]);
            this.FilterList.push(datas[i]);
          }
        }
        // console.log(this.FilterList)
      }
    }, error => {
      alert(error)
      console.log(error);
    })
  }

  createOnboarding(){
    this.router.navigate(['/menu/create-menu/'])
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.merchantInfoes, 'offlineBoarding');
 }

  linkToMenu(){
    //Open external url to replace current url
    // window.location.href='https://www.google.com';

    //Open external url as new tabl
    // window.open('https://update-pos.xindots.com/merchant-menu', '_blank')
    window.open(global.menu, '_blank')
  }

  showDetail(merchantInfo){
    localStorage.setItem('OfflineMerchantInfoes', JSON.stringify(merchantInfo));
    this.router.navigate(['menu/edit-menu/' + merchantInfo.Id])
  }

  onSelect(){
    let tokenNo = localStorage.getItem("Token");
    let getResUrl = global.host + "merchantinfoes/?token=" + tokenNo;
      if(this.itemSelected == 'Id'){
        for(var i=0; i<this.merchantInfoes.length; i++){
          this.idList.push(this.merchantInfoes[i]["Id"]);
        }
        // console.log(this.idList)
      }
      if(this.itemSelected == 'OutletName'){
        for(var i=0; i<this.merchantInfoes.length; i++){
          this.restaurantNameList.push(this.merchantInfoes[i]["RestaurantName"]);
        }
      }
      if(this.itemSelected == 'Mobile'){
        for(var i=0; i<this.merchantInfoes.length; i++){
          this.mobileNoList.push(this.merchantInfoes[i]["Mobile"]);
        }
      }
      // if(this.itemSelected == 'Email'){
      //   for(var i=0; i<this.merchantInfoes.length; i++){
      //     this.emailList.push(this.merchantInfoes[i]["Email"]);
      //   }
      // }
      if(this.itemSelected == 'Status'){
        for(var i=0; i<this.merchantInfoes.length; i++){
          this.statusList.push(this.merchantInfoes[i]["Status"]);
        }
      }
  }

  onKeySearch(value: any){
    //Search By Id
    if(this.itemSelected == 'Id'){
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = []
        for(var i=0; i<this.idList.length;i++){
          if((JSON.stringify(this.idList[i])).toLowerCase().includes((this.term).toLowerCase())){
            this.FilterList.push(this.merchantInfoes[i])
          }
          console.log(this.FilterList)
        }
        this.merchantInfoes = this.FilterList;
      }
    }
    //Search By Restaurant Name
    if(this.itemSelected == 'OutletName'){
      let allItems = this.merchantInfoes;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = [];
        for(var i=0; i<this.restaurantNameList.length; i++){
          if((JSON.stringify(this.restaurantNameList[i])).toLowerCase().includes((this.term).toLowerCase()) && JSON.stringify(this.restaurantNameList[i] != 'null')){
            this.FilterList.push(this.merchantInfoes[i])
          }
        }
        this.merchantInfoes = this.FilterList;
      }
    }
      
    //Search By Mobile No
    if(this.itemSelected == 'Mobile'){
      let allItems = this.merchantInfoes;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = [];
        for(var i=0; i<this.mobileNoList.length; i++){
          if((JSON.stringify(this.mobileNoList[i])).toLowerCase().includes((this.term).toLowerCase()) && (JSON.stringify(this.mobileNoList[i])) != "null"){
            this.FilterList.push(this.merchantInfoes[i])
          }
        }
        this.merchantInfoes = this.FilterList;
      }
    }

    //Search By Email
    if(this.itemSelected == 'Email'){
      let allItems = this.merchantInfoes;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = [];
        for(var i=0; i<this.emailList.length; i++){
          if((JSON.stringify(this.emailList[i])).toLowerCase().includes((this.term).toLowerCase()) && (JSON.stringify(this.emailList[i])) != 'null'){
            this.FilterList.push(this.merchantInfoes[i])
          }
        }
        this.merchantInfoes = this.FilterList;
      }
    }
 
    //Search By Status
    if(this.itemSelected == 'Status'){
      let allItems = this.merchantInfoes;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = []
        for(var i=0; i<this.statusList.length; i++){
          if((JSON.stringify(this.statusList[i])).toLowerCase().includes((this.term).toLowerCase()) && (JSON.stringify(this.statusList[i])) != "null"){
            this.FilterList.push(this.merchantInfoes[i])
          }
        }
        this.merchantInfoes = this.FilterList;
      }
    }
  }

  onKeydown(event){
    this.onKeySearch(String);
  }

  deleteInfoes(merchantInfo){
    localStorage.setItem("DeletingOfflineUser", JSON.stringify(merchantInfo));
  }

  delete(){
    let tokenNo = localStorage.getItem("Token");
    let getMerchantDetails = localStorage.getItem("DeletingOfflineUser");
    let deleteMerchantDetails = JSON.parse(getMerchantDetails);
    let id = deleteMerchantDetails['Id']

    this.http.delete(getMerchantDetails, {}).map(res => res.json()).subscribe(offlineMerchantInfoes => {
      if(offlineMerchantInfoes['Message']){
        console.log(offlineMerchantInfoes['Message'])
        alert(offlineMerchantInfoes['Message'])
        this.loadOfflineMerchant();
      }
    })
  }

  //Empty input
  emptyInput(){
    let tokenNo = localStorage.getItem("Token");
    let getResUrl = global.host + "merchantinfoes/?token=" + tokenNo;
    this.http.get(getResUrl, {}).map(res => res.json()).subscribe(data =>{
      this.merchantInfoes = data;
    })
  }
}
