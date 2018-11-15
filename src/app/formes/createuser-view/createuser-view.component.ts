import {Component,OnInit,Injectable,Inject,Optional,CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {FormBuilder,FormGroup,Validators,FormControl,FormsModule,ReactiveFormsModule,NgModel} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {Headers,URLSearchParams,RequestMethod,RequestOptions,RequestOptionsArgs,ResponseContentType,HttpModule,Http,Response} from "@angular/http";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { global } from "../../global";
import { AsyncLocalStorage } from "angular-async-local-storage";
import { AlertsService } from "angular-alert-module";
import { CustomValidators } from "ng2-validation";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { getDate } from "date-fns";
import { templateJitUrl } from "@angular/compiler";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown/angular2-multiselect-dropdown";
import { log } from "util";

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
  selector: 'app-createuser-view',
  templateUrl: './createuser-view.component.html',
  styleUrls: ['./createuser-view.component.scss']
})
export class CreateuserViewComponent implements OnInit {
  merchantDetails: any;
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
  registeredAddress: string;
  numberOfOutlet: number;
  country: string;
  outletAddress: Array<any> = [{Name:"", Address:""}];
  newOutletAddress: any = {};
  note: any = {};
  
  //image to base64
  nricOfApplication: any;
  clickedNric: any;
  neaLicenseImage: string;
  tobaccoAlcoholLicense: string;
  outletPhoto: string;
  nricFrontImage:string;
  nricBackImage: string;
  acraBizFile: string;

  hasGST: boolean = false;
  hasCreditCard: boolean = false;
  servChargeRate: number;
  postalcode: string;
  OpenTiming: Array<any>=[];

  isDraft: boolean;
  loaded = false;
  autosaveTimer = null;
  status: string;

  cuisines: "";
  cuisinesTypes: Array<any> = [];
  cuisinesSelected = [];
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

  public myForm: FormGroup;
  
  constructor( private router: Router, private fb: FormBuilder, private httpClient: HttpClient, public http: Http,
               public route: ActivatedRoute, private fBuilder: FormBuilder, private alerts: AlertsService) {}

  ngOnInit() {
     // Match Details
     this.merchantDetails = localStorage.getItem("EditingUser");
     let assignMerchantDetails = JSON.parse(this.merchantDetails);
    //  console.log(assignMerchantDetails);
     this.outletPhoto = assignMerchantDetails["OutletPhoto"];
     this.id = assignMerchantDetails["Id"];
     this.username = assignMerchantDetails["UserName"];
     this.password = assignMerchantDetails["Password"];
     this.cuisines = assignMerchantDetails["CuisineId"];
     this.categories = assignMerchantDetails["CategoryId"];
     this.email = assignMerchantDetails["Email"];
     this.firstname = assignMerchantDetails["FirstName"];
     this.lastname = assignMerchantDetails["LastName"];
     this.icNumber = assignMerchantDetails["NRIC"];
     this.mobile = assignMerchantDetails["Mobile"];
     this.accountTypeSelection = assignMerchantDetails["AccountType"];
     this.selectedSubscriptionsItems = JSON.parse(assignMerchantDetails["Subscription"]);
     this.bankName = assignMerchantDetails["BankName"];
     this.bankAccountName = assignMerchantDetails["BankAccountName"];
     this.bankAccountNumber = assignMerchantDetails["BankAccountNumber"];
     this.bankStatementEmail = assignMerchantDetails["BankStatementEmail"];
     this.nricFrontImage = assignMerchantDetails["NricFrontImage"];
     this.nricBackImage = assignMerchantDetails["NricBackImage"];
     this.neaLicenseImage = assignMerchantDetails["NeaLicenseImage"];
     this.tobaccoAlcoholLicense = assignMerchantDetails["TobaccoAlcoholLicense"];
     this.acraBizFile = assignMerchantDetails["ACRABizFile"]
     this.restaurantName = assignMerchantDetails["RestaurantName"];
     this.businessLegalName = assignMerchantDetails["BusinessLegalName"];
     this.acra = assignMerchantDetails["ACRA"];
     this.registeredAddress = assignMerchantDetails["RegisteredAddress"];
     this.outletAddress = JSON.parse(assignMerchantDetails["OutletAddress"]);
     this.qr = assignMerchantDetails["QR"];
     this.country = assignMerchantDetails["Country"];
     this.postalcode = assignMerchantDetails["PostalCode"];
     this.servChargeRate = assignMerchantDetails["ServChargeRate"];
     this.numberOfOutlet = assignMerchantDetails["NoOfOutlet"];
     this.legalEntitySelection = assignMerchantDetails["LegalEntityType"];
     this.hasGST = assignMerchantDetails["HasGST"];
     this.hasCreditCard = assignMerchantDetails["HasCreditCard"];
     this.OpenTiming = JSON.parse(assignMerchantDetails["OpenTiming"]);
     this.status = assignMerchantDetails["Status"];
     this.note = assignMerchantDetails["Note"];

     this.dropdownSubscriptionsList = [{ id: 1, itemName: "Restaurant" },{ id: 2, itemName: "Hawker" }];
     this.dropdownSettings = { singleSelection: false,
                               text: "Select Subscribe",
                               selectAllText: "Select All",
                               unSelectAllText: "UnSelect All",
                               enableSearchFilter: true,
                               classes: "myclass custom-class" };
  }

  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }

  addOutletAddress(){
    this.outletAddress.push(this.newOutletAddress);
    this.newOutletAddress = {};
  }
  deleteOutletAddress(index){
    this.outletAddress.splice(index, 1);
  }

  addOperationTime(inDayIdx, inOpTimeIdx){
    this.OpenTiming[inDayIdx].OperationHourList.push(new OperationHour("08:00", "22:00"));
    console.log(this.OpenTiming)
  }

  removeOperationTime(inDayIdx, inOpTimeIdx){
    this.OpenTiming[inDayIdx].OperationHourList.splice(inOpTimeIdx, 1)
  }

  openTimeChanged(event,dayIdx, i){
    if(event == ""){
      this.OpenTiming[dayIdx].OperationHourList[i].OpenTime = "00:00";
    }
    console.log(event);
  }

  closeTimeChanged(event,dayIdx, i){
    if(event == ""){
      this.OpenTiming[dayIdx].OperationHourList[i].CloseTime = "00:00";
    }
    console.log(event);
  }

  // Convert outlet photo to base64
  _outletPhotohandleReaderLoaded(e) {
    var reader = e.target;
    this.outletPhoto = reader.result;
    this.loaded = true;
  }
  // Convert outlet photo to Base64 format
  changeListenerOutletPhoto(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file == undefined) {
      this.outletPhoto = undefined;
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this._outletPhotohandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  // Convert Nric(Front) image to base64
  _nricFrontHandleReaderLoaded(e) {
    var reader = e.target;
    this.nricFrontImage = reader.result;
    this.loaded = true;
  }
  // Convert Nric(Front) Image to Base64 format
  changeListenerNricFront(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file == undefined) {
      this.nricFrontImage = undefined;
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this._nricFrontHandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  // Convert Nric(Back) image to base64
  _nricBackhandleReaderLoaded(e) {
    var reader = e.target;
    this.nricBackImage = reader.result;
    this.loaded = true;
  }
  // Convert Nric(Back) Image to Base64 format
  changeListenerNricBack(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file == undefined) {
      this.nricBackImage = undefined;
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this. _nricBackhandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  // Convert acraBizFile image to base64
  _acraBizFilehandleReaderLoaded(e) {
    var reader = e.target;
    this.acraBizFile = reader.result;
    this.loaded = true;
  }
  // Convert acraBizFile Image to Base64 format
  changeListenerAcraBizFile(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file == undefined) {
      this.acraBizFile = undefined;
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this. _acraBizFilehandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  // Convert NeaLicense image to base64
  _neaHandleReaderLoaded(e) {
    var reader = e.target;
    this.neaLicenseImage = reader.result;
    this.loaded = true;
  }
  // Convert NeaLicense Image to Base64 format
  changeListenerNea(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file == undefined) {
      this.neaLicenseImage = undefined;
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this._neaHandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  // Convert TobaccoAlcoholLicense image to base64
  _tobHandleReaderLoaded(e) {
    var reader = e.target;
    this.tobaccoAlcoholLicense = reader.result;
    this.loaded = true;
  }
  // Convert TobaccoAlcoholLicense Image to Base64 format
  changeListenerTob(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file == undefined) {
      this.tobaccoAlcoholLicense = undefined;
      return;
    }
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert("invalid format");
      return;
    }
    this.loaded = false;
    reader.onload = this._tobHandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  removeFrontIC() {
    this.nricFrontImage = "";
  }
  removeBackIC(){
    this.nricBackImage = "";
  }
  removeNEA() {
    this.neaLicenseImage = "";
  }
  removeTob() {
    this.tobaccoAlcoholLicense = "";
  }
  removeAcra(){
    this.acraBizFile = "";
  }
  // cuisinesCheck(){
  //   let tokenNo = localStorage.getItem("Token");
  //   let getCuisinesUrl = global.host + "Cuisines" + "?token=" + tokenNo;
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
  //   // console.log(this.categories)
  // }

  // Save and Submit
  saveDraft(inIsDraft) {
    // Input Validation for save draft
    if (this.mobile !== undefined && this.username !== undefined) {
      this.appInfo = {
        // "Id": (this.appInfo == null)?0:this.appInfo['Id'],
        Id: this.id,
        UserName: this.username,
        Password: this.password,
        CuisineId: this.cuisines,
        CategoryId:this.categories,
        AccountType: this.accountTypeSelection,
        Email: this.email,
        Firstname: this.firstname,
        Lastname: this.lastname,
        NRIC: this.icNumber,
        Mobile: '+65-'+this.mobile,
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
        NricFrontImage:  this.nricFrontImage,
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
        ConvertToOnboarding: false,
      };
      let tokenNo = localStorage.getItem("Token");
      let getResUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      let isExistingUser = this.appInfo["Id"] > 0;

      //Checking existing username
      // let boardingGetUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      // this.http.get(boardingGetUrl, {}).map(res => res.json()).subscribe(data => {
      //     for (var i = 0; i < data.length; i++) {
      //       if (this.username === data[i]["UserName"]) {
      //         window.alert("User already in used");
      //       }
      //     }
          let httpCall = isExistingUser ? this.http.post(getResUrl, this.appInfo, {}): this.http.post(getResUrl, this.appInfo, {});
          httpCall.map(res => res.json()).subscribe(data => {
              console.log(data);
              if (data["Message"] == undefined) {
                // console.log(data["Message"]);
                if (this.appInfo["Status"] === "Pending") {
                  this.router.navigate(["/formes"]);
                } else {
                  this.router.navigate(["/formes"]);
                }
              } else {
                console.log(data["Message"]);
              }
            },
            error => {
              console.log(error);
            }
          );
        // });
    } 
    else {
      window.alert("Please fill in Username and Mobile Number");
    }
  }

  onSubmit(){
    // Input Validation for save draft
    if (this.username !== '' && this.mobile !== undefined && this.password !== '' && this.country !== '' && this.postalcode !== ''
    && this.email !== '' && this.firstname !== '' && this.lastname !== '' && this.mobile !== '' && this.icNumber !== '' 
    && this.legalEntitySelection !== undefined && this.bankName !== '' && this.bankAccountName !== '' && this.cuisines !==undefined && this.categories != undefined
    && this.bankAccountNumber !== '' && this.nricFrontImage != '' && this.nricBackImage != '' && this.businessLegalName !== '' 
    && this.acra !== '' && this.registeredAddress !== '' && this.numberOfOutlet !== undefined && this.restaurantName !== '') {
      this.appInfo = {
        // "Id": (this.appInfo == null)?0:this.appInfo['Id'],
        Id: this.id,
        UserName: this.username,
        Password: this.password,
        CuisineId: this.cuisines,
        CategoryId: this.categories,
        AccountType: this.accountTypeSelection,
        Email: this.email,
        Firstname: this.firstname,
        Lastname: this.lastname,
        NRIC: this.icNumber,
        Mobile: '+65-'+this.mobile,
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
        NricFrontImage:  this.nricFrontImage,
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
        ConvertToOnboarding: true,
      };
      let tokenNo = localStorage.getItem("Token");
      let getResUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      let isExistingUser = this.appInfo["Id"] > 0;

      //Checking existing username
      // let boardingGetUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      // this.http.get(boardingGetUrl, {}).map(res => res.json()).subscribe(data => {
      //     for (var i = 0; i < data.length; i++) {
      //       if (this.username === data[i]["UserName"]) {
      //         window.alert("User already in used");
      //       }
      //     }
          let httpCall = isExistingUser ? this.http.post(getResUrl, this.appInfo, {}): this.http.post(getResUrl, this.appInfo, {});
          httpCall.map(res => res.json()).subscribe(data => {
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
              }
            },
            error => {
              console.log(error);
            }
          );
        // });
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
