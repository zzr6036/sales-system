import { Component, OnInit, Injectable, Inject, Optional, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule, NgModel, FormArray } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Headers, URLSearchParams, RequestMethod, RequestOptions, RequestOptionsArgs, ResponseContentType, HttpModule, Http, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { global } from "../../global";
import { server } from "../../server";
import { AsyncLocalStorage } from "angular-async-local-storage";
import { AlertsService } from "angular-alert-module";
import { CustomValidators } from "ng2-validation";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { getDate } from "date-fns";
import { templateJitUrl } from "@angular/compiler";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import Swal from "sweetalert2";
import { log } from "util";
import { map, expand } from "rxjs/operators";
import "rxjs/add/observable/empty";
import { CompressorService } from ".././compressor.service";

class OperationHour {
  OpenTime;
  CloseTime;

  constructor(inOpenTime = "11:00", inCloseTime = "14:00") {
    this.OpenTime = inOpenTime;
    this.CloseTime = inCloseTime;
  }
}

class OperationItem {
  Name;
  ShortName;
  OperationHourList;
  ClosedToday;

  constructor(
    inName = "Monday",
    inShortName = "Mon",
    inOperationHourList = [],
    inClosedToday = false
  ) {
    this.Name = inName;
    this.ShortName = inShortName;
    this.OperationHourList = inOperationHourList;
    this.ClosedToday = inClosedToday;
  }
}

@Component({
  selector: "app-createuser",
  templateUrl: "./createuser.component.html",
  styleUrls: ["./createuser.component.scss"]
})
export class CreateuserComponent implements OnInit {
  appInfo: any;

  id: number;
  username: string;
  password: string;
  accountType = ["Restaurant", "Hawker"];
  accountTypeSelection: string;
  email: string;
  firstname: string;
  lastname: string;
  icNumber: string;
  mobile: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankStatementEmail: string;
  restaurantName: string;
  businessLegalName: string;
  acra: string;
  country: string;
  postalcode: string;
  registeredAddress: string;
  numberOfOutlet: number;
  outletAddress: Array<any> = [{ Name: "", Address: "" }];
  newOutletAddress: any = {};
  OpenTiming: Array<any> = [];

  //image to base64
  nricOfApplication: any;
  clickedNric: any;
  neaLicenseImage: string;
  tobaccoAlcoholLicense: string;
  outletPhoto: string;
  outletCompressedPhoto: string;
  nricFrontImage: string;
  nricBackImage: string;
  acraBizFile: string;

  hasGST: boolean = false;
  hasCreditCard: boolean = false;
  servChargeRate: number;

  isDraft: boolean;
  loaded = false;
  autosaveTimer = null;
  status: string;

  cuisines: "";
  cuisinesTypes: Array<any> = [];
  // cuisinesIds: Array<any> = [];
  // cuisinesNames: Array<any> = [];
  cuisinesSelected = [];
  cuisineLists = [];

  // categoriesIds: Array<any> = [];
  // categoriesNames: Array<any> = [];
  categories: "";
  categoriesTypes: Array<any> = [];
  categoriesSelected = [];

  dropdownSubscriptionsList = [];
  selectedSubscriptionsItems = [];
  dropdownSettings = {};

  // Dropdown list ngModel binding
  legalEntityType = [
    "NEA Hawker",
    "Limited Liability Company",
    "Private Limited Company",
    "Public Limited Company",
    "Public Company Limited by Guarantee",
    "Foreign Company Registration",
    "Sole Proprietorship",
    "General Partnership",
    "Limited Liability Partnership (LLP)"
  ];
  legalEntitySelection: "";

  //compress
  data: FileList;
  compressedImages = [];
  recursiveCompress = (image: File, index, array, width:number = 500) => {
    return this.compressor.compress(image, width).pipe(
      map(response => {
        //Code block after completing each compression
        // console.log("compressed " + index + image.name);
        this.compressedImages.push(response);
        return {
          data: response,
          index: index + 1,
          array: array
        };
      })
    );
  };

  public myForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    public http: Http,
    public route: ActivatedRoute,
    private fBuilder: FormBuilder,
    private alerts: AlertsService,
    private compressor: CompressorService
  ) {}

  ngOnInit() {
    this.initOperationList();
    this.dropdownSubscriptionsList = [
      { id: 1, itemName: "Restaurant" },
      { id: 2, itemName: "Hawker" }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Subscribe",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }
  initOperationList() {
    this.OpenTiming.push(new OperationItem("Monday", "Mon", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem("Tuesday", "Tue", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem("Wednesday", "Wed", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem("Thursday", "Thur", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem("Friday", "Fri", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem("Saturday", "Sat", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem("Sunday", "Sun", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem( "Eve Of Public Holiday", "EveOfP.H", [new OperationHour()], false));
    this.OpenTiming.push(new OperationItem("Public Holiday", "P.H", [new OperationHour()], false));
    // console.log(this.menuDetails.OpenTiming)
  }

  addOperationTime(inDayIdx, inOpTimeIdx) {
    this.OpenTiming[inDayIdx].OperationHourList.push(new OperationHour("11:00", "14:00"));
    console.log(this.OpenTiming);
  }

  removeOperationTime(inDayIdx, inOpTimeIdx) {
    this.OpenTiming[inDayIdx].OperationHourList.splice(inOpTimeIdx, 1);
  }

  openTimeChanged(event, dayIdx, i) {
    if (event == "") {
      this.OpenTiming[dayIdx].OperationHourList[i].OpenTime = "00:00";
    }
    console.log(event);
  }

  closeTimeChanged(event, dayIdx, i) {
    if (event == "") {
      this.OpenTiming[dayIdx].OperationHourList[i].CloseTime = "00:00";
    }
    console.log(event);
  }

  // onChangeCuisinesSelect(event){
  //   this.cuisines = event.target.value
  // }

  onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedSubscriptionsItems);
  }
  OnItemDeSelect(item: any) {}
  onSelectAll(items: any) {}
  onDeSelectAll(items: any) {}

  addOutletAddress() {
    this.outletAddress.push(this.newOutletAddress);
    this.newOutletAddress = {};
  }
  deleteOutletAddress(index) {
    this.outletAddress.splice(index, 1);
  }

  compress(event, width:number = 500) {
    this.data = event.target.files;
    const compress = this.recursiveCompress(this.data[0], 0, this.data, width).pipe(
      expand(res => {
        return res.index > res.array.length - 1
          ? Observable.empty()
          : this.recursiveCompress(this.data[res.index], res.index, this.data, width);
      })
    );
    return compress;
  }

  //Convert outlet photo to base64
  changeListenerOutletPhoto(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      let compressObs = this.compress(event, 600);
      compressObs.subscribe(res => {
          if (res.index > res.array.length - 1) {
            reader.onloadend = e => {
              this.outletPhoto = reader.result;
            };
            reader.readAsDataURL(this.compressedImages[0]);
            // reader.readAsDataURL(file)
          }
        });
    }
  }

  //convert nric(front) to base64
  changeListenerNricFront(event){
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      let compressObs = this.compress(event, 600);
      compressObs.subscribe(res => {
          if (res.index > res.array.length - 1) {
            reader.onloadend = e => {
              this.nricFrontImage = reader.result;
            };
            reader.readAsDataURL(this.compressedImages[0]);
          }
        });
    }
  }

  // Convert Nric(Back) Image to Base64 format
  changeListenerNricBack(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      let compressObs = this.compress(event, 600);
      compressObs.subscribe(res => {
          if (res.index > res.array.length - 1) {
            reader.onloadend = e => {
              this.nricBackImage = reader.result;
            };
            reader.readAsDataURL(this.compressedImages[0]);
          }
        });
    }
  }
  // Convert acraBizFile Image to Base64 format
  changeListenerAcraBizFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      let compressObs = this.compress(event, 600);
      compressObs.subscribe(res => {
          if (res.index > res.array.length - 1) {
            reader.onloadend = e => {
              this.acraBizFile = reader.result;
            };
            reader.readAsDataURL(this.compressedImages[0]);
          }
        });
    }
  }

  // Convert NeaLicense image to base64
  changeListenerNea(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      let compressObs = this.compress(event, 600);
      compressObs.subscribe(res => {
          if (res.index > res.array.length - 1) {
            reader.onloadend = e => {
              this.neaLicenseImage = reader.result;
            };
            reader.readAsDataURL(this.compressedImages[0]);
          }
        });
    }
  }

  // Convert TobaccoAlcoholLicense Image to Base64 format
  changeListenerTob(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      let compressObs = this.compress(event, 600);
      compressObs.subscribe(res => {
          if (res.index > res.array.length - 1) {
            reader.onloadend = e => {
              this.tobaccoAlcoholLicense = reader.result;
            };
            reader.readAsDataURL(this.compressedImages[0]);
          }
        });
    }
  }

  removeFrontIC() {
    this.nricFrontImage = "";
  }
  removeBackIC() {
    this.nricBackImage = "";
  }
  removeNEA() {
    this.neaLicenseImage = "";
  }
  removeTob() {
    this.tobaccoAlcoholLicense = "";
  }
  removeAcra() {
    this.acraBizFile = "";
  }

  // cuisinesCheck(){
  // let tokenNo = localStorage.getItem("Token");
  // let getCuisinesUrl = global.host + "Cuisines" + "?token=" + tokenNo;
  //   this.http.get(getCuisinesUrl, {}).map(res=>res.json()).subscribe(data => {
  //     if(data['Message']){
  //       console.log(data['Message'])
  //     }
  //     else{
  //       this.cuisinesTypes = data
  //       this.initSelectedCuisines()
  //     }
  //   },
  // error=>{
  //   console.log(error)
  // })
  // }
  // initSelectedCuisines(){
  //   this.cuisinesSelected = new Array<boolean>(this.cuisinesTypes.length).fill(false);
  // }
  // cuisineType(){
  //   let i=0;
  //   for(let isSelected of this.cuisinesSelected){
  //     if(isSelected){
  //       this.cuisines = this.cuisinesTypes[i].Id
  //     }
  //     i++;
  //   }
  //   // console.log(this.cuisines)
  // }

  // categoriesCheck(){
  //   let tokenNo = localStorage.getItem("Token");
  //   let getCategoriesUrl = global.host + "Categories" + "?token=" + tokenNo;
  //   this.http.get(getCategoriesUrl, {}).map(res=>res.json()).subscribe(data => {
  //     if(data['Message']){
  //       console.log(data['Message'])
  //     }
  //     else{
  //       this.categoriesTypes = data
  //       this.initSelectedCategories()
  //     }
  //   },
  // error=>{
  //   console.log(error)
  // })
  // }
  // initSelectedCategories(){
  //   this.categoriesSelected = new Array<boolean>(this.categoriesTypes.length).fill(false);
  // }
  // categoryType(){
  //   let i=0;
  //   for(let isSelected of this.categoriesSelected){
  //     if(isSelected){
  //       this.categories = this.categoriesTypes[i].Id
  //     }
  //     i++;
  //   }
  //   console.log(this.categories)
  // }

  // Save and Submit
  saveDraft(inIsDraft) {
    // Input Validation for save draft
    if (this.mobile !== undefined && this.username !== undefined) {
      this.appInfo = {
        // "Id": (this.appInfo == null)?0:this.appInfo['Id'],
        Id: this.id,
        UserName: this.username,
        CuisineId: parseInt(this.cuisines),
        CategoryId: parseInt(this.categories),
        Password: this.password,
        AccountType: this.accountTypeSelection,
        Email: this.email,
        Firstname: this.firstname,
        Lastname: this.lastname,
        NRIC: this.icNumber,
        Mobile: "+65-" + this.mobile,
        BankName: this.bankName,
        BankAccountName: this.bankAccountName,
        BankAccountNumber: this.bankAccountNumber,
        BankStatementEmail: this.bankStatementEmail,
        RestaurantName: this.restaurantName,
        BusinessLegalName: this.businessLegalName,
        ACRA: this.acra,
        RegisteredAddress: this.registeredAddress,
        OutletAddress: JSON.stringify(this.outletAddress),
        NoOfOutlet: this.numberOfOutlet,
        LegalEntityType: this.legalEntitySelection,
        OpenTiming: JSON.stringify(this.OpenTiming),
        //image to base64
        NricFrontImage: this.nricFrontImage,
        NricBackImage: this.nricBackImage,
        NeaLicenseImage: this.neaLicenseImage,
        TobaccoAlcoholLicense: this.tobaccoAlcoholLicense,
        ACRABizFile: this.acraBizFile,
        OutletPhoto: this.outletPhoto,
        Subscription: JSON.stringify(this.selectedSubscriptionsItems),
        HasGST: this.hasGST,
        HasCreditCard: this.hasCreditCard,
        ServChargeRate: this.servChargeRate,
        Country: this.country,
        PostalCode: this.postalcode,
        Status: "draft",
        ConvertToOnboarding: false
      };
      let tokenNo = localStorage.getItem("Token");
      let getResUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      let isExistingUser = this.appInfo["Id"] > 0;

      //Checking existing username
      let boardingGetUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      this.http
        .get(boardingGetUrl, {})
        .map(res => res.json())
        .subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            if (this.username === data[i]["UserName"]) {
              window.alert("User already in used");
            }
          }
          let httpCall = isExistingUser
            ? this.http.post(getResUrl, this.appInfo, {})
            : this.http.post(getResUrl, this.appInfo, {});
          httpCall
            .map(res => res.json())
            .subscribe(
              data => {
                // console.log(data);
                if (data["Message"] == undefined) {
                  // console.log(data["Message"]);
                  if (this.appInfo["Status"] === "Pending") {
                    this.router.navigate(["/formes"]);
                  } else {
                    this.router.navigate(["/formes"]);
                  }
                } else {
                  console.log(data["Message"]);
                  alert(data["Message"]);
                }
              },
              error => {
                console.log(error);
                alert(error);
              }
            );
        });
    } else {
      window.alert("Please fill in Username and Mobile Number");
    }
  }

  onSubmit() {
    // Input Validation for save draft
    if (
      this.username !== undefined &&
      this.mobile !== undefined &&
      this.password !== undefined &&
      this.country !== undefined &&
      this.postalcode !== undefined &&
      this.email !== undefined &&
      this.firstname !== undefined &&
      this.lastname !== undefined &&
      this.mobile !== undefined &&
      this.icNumber !== undefined &&
      this.legalEntitySelection !== undefined &&
      this.bankName !== undefined &&
      this.bankAccountName !== undefined &&
      this.bankAccountNumber !== undefined &&
      this.nricFrontImage != undefined &&
      this.nricBackImage != undefined &&
      this.businessLegalName !== undefined &&
      this.acra !== undefined &&
      this.registeredAddress !== undefined &&
      this.numberOfOutlet !== undefined &&
      this.restaurantName !== undefined &&
      this.username !== "" &&
      this.mobile !== "" &&
      this.password !== "" &&
      this.country !== "" &&
      this.postalcode !== "" &&
      this.email !== "" &&
      this.firstname !== "" &&
      this.lastname !== "" &&
      this.mobile !== "" &&
      this.icNumber !== "" &&
      this.legalEntitySelection !== "" &&
      this.bankName !== "" &&
      this.bankAccountName !== "" &&
      this.bankAccountNumber !== "" &&
      this.nricFrontImage != "" &&
      this.nricBackImage != "" &&
      this.businessLegalName !== "" &&
      this.acra !== "" &&
      this.registeredAddress !== "" &&
      this.numberOfOutlet !== null &&
      this.restaurantName !== ""
    ) {
      this.appInfo = {
        // "Id": (this.appInfo == null)?0:this.appInfo['Id'],
        Id: this.id,
        UserName: this.username,
        CuisineId: parseInt(this.cuisines),
        CategoryId: parseInt(this.categories),
        Password: this.password,
        AccountType: this.accountTypeSelection,
        Email: this.email,
        Firstname: this.firstname,
        Lastname: this.lastname,
        NRIC: this.icNumber,
        Mobile: "+65-" + this.mobile,
        BankName: this.bankName,
        BankAccountName: this.bankAccountName,
        BankAccountNumber: this.bankAccountNumber,
        BankStatementEmail: this.bankStatementEmail,
        RestaurantName: this.restaurantName,
        BusinessLegalName: this.businessLegalName,
        ACRA: this.acra,
        RegisteredAddress: this.registeredAddress,
        OutletAddress: JSON.stringify(this.outletAddress),
        NoOfOutlet: this.numberOfOutlet,
        LegalEntityType: this.legalEntitySelection,
        OpenTiming: JSON.stringify(this.OpenTiming),
        NricFrontImage: this.nricFrontImage,
        NricBackImage: this.nricBackImage,
        NeaLicenseImage: this.neaLicenseImage,
        TobaccoAlcoholLicense: this.tobaccoAlcoholLicense,
        ACRABizFile: this.acraBizFile,
        OutletPhoto: this.outletPhoto,
        Subscription: JSON.stringify(this.selectedSubscriptionsItems),
        HasGST: this.hasGST,
        HasCreditCard: this.hasCreditCard,
        ServChargeRate: this.servChargeRate,
        Country: this.country,
        PostalCode: this.postalcode,
        Status: "pending",
        ConvertToOnboarding: true
      };
      let tokenNo = localStorage.getItem("Token");
      let getResUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      let isExistingUser = this.appInfo["Id"] > 0;

      //Checking existing username
      let boardingGetUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      this.http
        .get(boardingGetUrl, {})
        .map(res => res.json())
        .subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            if (this.username === data[i]["UserName"]) {
              window.alert("User already in used");
            }
          }
          let httpCall = isExistingUser
            ? this.http.post(getResUrl, this.appInfo, {})
            : this.http.post(getResUrl, this.appInfo, {});
          httpCall
            .map(res => res.json())
            .subscribe(
              data => {
                // console.log(data);
                if (data["Message"] == undefined) {
                  Swal({
                    position: "center",
                    type: "success",
                    title: "Submit Successfully!",
                    showConfirmButton: false,
                    timer: 1500
                  }).then(() => {
                    if (
                      this.appInfo["Status"] === "Pending" ||
                      this.appInfo["Status"] === "pending"
                    ) {
                      this.router.navigate(["/formes"]);
                    } else {
                      this.router.navigate(["/formes"]);
                    }
                  });
                } else {
                  alert(data["Message"]);
                  console.log(data["Message"]);
                }
              },
              error => {
                console.log(error);
                alert(error);
              }
            );
        });
    } else {
      window.alert("All the * fields are required");
    }
  }
  autosave() {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }
    this.autosaveTimer = setTimeout(() => {}, 5000);
  }
}
