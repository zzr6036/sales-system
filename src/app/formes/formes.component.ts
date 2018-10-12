import { Component, OnInit, Pipe, PipeTransform, Injectable } from "@angular/core";
import { HttpModule, Http, Response } from "@angular/http";
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { global } from "../global";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import * as _ from "underscore";
import { PaginationService } from "../services/index";
import { CreateuserService } from "./shared/createuser.service";
import { FilterPipe } from "./../filter.pipe";
import { SearchPipe } from "./../search.pipe";
import Swal from 'sweetalert2';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe'; 
import { id } from "@swimlane/ngx-charts/release/utils";
import { ExcelService } from '../services/excel.service';

@Component({
  selector: "app-formes",
  templateUrl: "./formes.component.html",
  styleUrls: ["./formes.component.scss"],
  providers: [CreateuserService]
  // template: `LastUpdated: {{ mydate | amLocal | amDateFormat: 'YYYY-MM-DD'}}`
})
export class FormesComponent implements OnInit {
  accounts: Array<any> = [];
  Id: number;
  Email: string;
  public term: any;

  //Search
  itemSelected: String;
  selections = ["Id", "RestaurantName", "Mobile", "Email", "Status"];
  idList: Array<any> = [];
  restaurantNameList: Array<any> = [];
  emailList: Array<any> = [];
  mobileNoList: Array<any> = [];
  statusList: Array<any> = [];
  FilterList: Array<any> = [];

  constructor(
    private createuserService: CreateuserService,
    public http: Http,
    private router: Router,
    private paginationService: PaginationService,
    private route: ActivatedRoute,
    private excelService: ExcelService,
  ) {
    this.route.params.subscribe(params => {
      // console.log(params);
    });
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.accounts, 'onBoarding');
 }

  momentFormat() {}

  ngOnInit() {
    this.router.navigate(['/formes/'])
    let roleName = localStorage.getItem("RoleName");
    // if (roleName === "Sales" || roleName === "TeamLeader" || roleName === "TeamMember") {
      let tokenNo = localStorage.getItem("Token");
      let getResUrl = global.host + "merchantinfoes/?token=" + tokenNo;
      if (tokenNo === "") {
        window.alert("Internet Error");
      } 
      else {
        this.http.get(getResUrl, {}).map(res => res.json()).subscribe(data => {
              // console.log(data);
              if (data["Message"]) {
                console.log(data["Message"]);
              } else {
                this.accounts = data;
                this.FilterList = data;

              }
            },
            error => {
              console.log(error);
            }
          );
      }
  }
  onSelect(){
    let tokenNo = localStorage.getItem("Token");
    let getResUrl = global.host + "merchantinfoes/?token=" + tokenNo;
    this.http.get(getResUrl, {}).map(res => res.json()).subscribe(data => {
      if(this.itemSelected == 'Id'){
        for(var i=0; i<data.length; i++){
          this.idList.push(data[i]["Id"]);
        }
        // console.log(this.idList)
      }
      if(this.itemSelected == 'RestaurantName'){
        for(var i=0; i<data.length; i++){
          this.restaurantNameList.push(data[i]["RestaurantName"]);
        }
      }
      if(this.itemSelected == 'Mobile'){
        for(var i=0; i<data.length; i++){
          this.mobileNoList.push(data[i]["Mobile"]);
        }
      }
      if(this.itemSelected == 'Email'){
        for(var i=0; i<data.length; i++){
          this.emailList.push(data[i]["Email"]);
        }
      }
      if(this.itemSelected == 'Status'){
        for(var i=0; i<data.length; i++){
          this.statusList.push(data[i]["Status"]);
        }
      }
    })
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
            this.FilterList.push(this.accounts[i])
          }
        }
        this.accounts = this.FilterList;
      }
    }
    //Search By Restaurant Name
    if(this.itemSelected == 'RestaurantName'){
      let allItems = this.accounts;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = [];
        for(var i=0; i<this.restaurantNameList.length; i++){
          if((JSON.stringify(this.restaurantNameList[i])).toLowerCase().includes((this.term).toLowerCase()) && JSON.stringify(this.restaurantNameList[i] != 'null')){
            this.FilterList.push(this.accounts[i])
          }
        }
        this.accounts = this.FilterList;
      }
    }
      
    //Search By Mobile No
    if(this.itemSelected == 'Mobile'){
      let allItems = this.accounts;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = [];
        for(var i=0; i<this.mobileNoList.length; i++){
          if((JSON.stringify(this.mobileNoList[i])).toLowerCase().includes((this.term).toLowerCase()) && (JSON.stringify(this.mobileNoList[i])) != "null"){
            this.FilterList.push(this.accounts[i])
          }
        }
        this.accounts = this.FilterList;
      }
    }

    //Search By Email
    if(this.itemSelected == 'Email'){
      let allItems = this.accounts;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = [];
        for(var i=0; i<this.emailList.length; i++){
          if((JSON.stringify(this.emailList[i])).toLowerCase().includes((this.term).toLowerCase()) && (JSON.stringify(this.emailList[i])) != 'null'){
            this.FilterList.push(this.accounts[i])
          }
        }
        this.accounts = this.FilterList;
      }
    }
 
    //Search By Status
    if(this.itemSelected == 'Status'){
      let allItems = this.accounts;
      if(this.term == ''){
        this.emptyInput();
      }
      else {
        this.FilterList = []
        for(var i=0; i<this.statusList.length; i++){
          if((JSON.stringify(this.statusList[i])).toLowerCase().includes((this.term).toLowerCase()) && (JSON.stringify(this.statusList[i])) != "null"){
            this.FilterList.push(this.accounts[i])
          }
        }
        this.accounts = this.FilterList;
      }
    }
  }

  onKeydown(event){
    this.onKeySearch(String);
  }
  
  createNewUser(){
    this.router.navigate(['/formes/createuser'])
    // let roleName = localStorage.getItem("RoleName");
    // if(roleName === "Sales" || roleName === "TeamLeader" || roleName === "TeamMember"){
    //   this.router.navigate(['/formes/createuser'])
    // }
    // else{
    //   Swal({
    //     position: 'center',
    //     type: 'warning',
    //     title: 'You are not allowed to create new merchant account!',
    //     showConfirmButton: true,
    //     // timer: 2500
    //   }).then(()=>{
    //     this.router.navigate(['/formes/']);
    //   })
    //   // window.alert("You are not allowed to create new merchant account");
    // } 
  }

  merchantSearch(event, formData) {
    let query = formData.value["q"];
    if (query) {
      this.router.navigate(["formes", { q: query }]);
    }
  }
  showDetail(account) {
    localStorage.setItem("EditingUser", JSON.stringify(account));
    let Status = account.Status;
    if (Status === "approved" || Status === "pending" || Status === "Pending") {
      this.router.navigate(["formes/createuser-view/" + account.Id]);
    } else if (Status === "draft" || Status === "Draft" || Status === "rejected" || Status === "Rejected") {
      let roleName = localStorage.getItem("RoleName");
      if(roleName === "Sales" || roleName === "TeamLeader" || roleName === "TeamMember"){
        this.router.navigate(["formes/createuser-edit/" + account.Id]);
      }
      else{
        Swal({
          position: 'center',
          type: 'warning',
          title: 'You are not allowed to edit merchant information!',
          showConfirmButton: true,
        }).then(()=>{
          this.router.navigate(['/formes/']);
        })
      }
    }
  }

  //Empty input
  emptyInput(){
    let tokenNo = localStorage.getItem("Token");
    let getResUrl = global.host + "merchantinfoes/?token=" + tokenNo;
    this.http.get(getResUrl, {}).map(res => res.json()).subscribe(data =>{
      this.accounts = data;
    })
  }
}
