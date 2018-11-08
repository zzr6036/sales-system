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
import Swal from 'sweetalert2';
import { log } from "util";
import { toString } from "@ng-bootstrap/ng-bootstrap/util/util";

@Component({
  selector: 'app-createuser-edit',
  templateUrl: './createuser-edit.component.html',
  styleUrls: ['./createuser-edit.component.scss']
})
export class CreateuserEditComponent implements OnInit {
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
  qr: number;
  country: string;
  postalcode: string;
  outletAddress: Array<any> = [{Name:"", Address:""}];
  newOutletAddress: any={};
  
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

  isDraft: boolean;
  loaded = false;
  autosaveTimer = null;
  status: string;

  cuisines: string;
  cuisinesTypes: Array<any> = [];
  cuisinesSelected = [];
  categories: string;
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

  isClosedMonday: boolean = false;
  isClosedTuesday: boolean = false;
  isClosedWednesday: boolean = false;
  isClosedThursday: boolean = false;
  isClosedFriday: boolean = false;
  isClosedSaturday: boolean = false;
  isClosedSunday: boolean = false;
  isClosedPublicHoliday: boolean = false;
  isClosedEveOfPH: boolean = false;

  // public mondayDurations: Array<any> = [];
  // public newMondayDuration: any = {};
  public mondayDurations = [{OpenTime:"", CloseTime:""}];
  public newMondayDuration: any = {};

  public tuesdayDurations = [{OpenTime:"", CloseTime:""}];
  public newTuesdayDuration: any = {};

  public wednesdayDurations = [{OpenTime:"", CloseTime:""}];
  public newWednesdayDuration: any = {};

  public thursdayDurations = [{OpenTime:"", CloseTime:""}];
  public newThursdayDuration: any = {};

  public fridayDurations = [{OpenTime:"", CloseTime:""}];
  public newFridayDuration: any = {};

  public saturdayDurations =  [{OpenTime:"", CloseTime:""}];
  public newSaturdayDuration: any = {};

  public sundayDurations = [{OpenTime:"", CloseTime:""}];
  public newSundayDuration: any = {};

  public publicHolidayDurations = [{OpenTime:"", CloseTime:""}];;
  public newPublicHolidayDuration: any = {};

  public eveOfPHs = [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newEveOfPH: any = {};

  openTiming = [
    {Name: "Monday", ShortName: "Mon", OperationHourList: this.mondayDurations, ClosedToday: this.isClosedMonday},
    {Name: "Tuesday", ShortName: "Tue", OperationHourList: this.tuesdayDurations, ClosedToday: this.isClosedTuesday},
    {Name: "Wednesday", ShortName: "Wed", OperationHourList: this.wednesdayDurations, ClosedToday: this.isClosedWednesday},
    {Name: "Thursday", ShortName: "Thur", OperationHourList: this.thursdayDurations, ClosedToday: this.isClosedThursday},
    {Name: "Friday", ShortName: "Fri", OperationHourList: this.fridayDurations, ClosedToday: this.isClosedFriday},
    {Name: "Saturday", ShortName: "Sat", OperationHourList: this.saturdayDurations, ClosedToday: this.isClosedSaturday},
    {Name: "Sunday", ShortName: "Sun", OperationHourList: this.sundayDurations, ClosedToday: this.isClosedSunday},
    {Name: "Public Holiday", ShortName: "PH", OperationHourList: this.publicHolidayDurations, ClosedToday: this.isClosedPublicHoliday},
    {Name: "Eve Of Public Holiday", ShortName: "EveOfP.H", OperationHourList: this.eveOfPHs, ClosedToday: this.isClosedEveOfPH}
  ];

  public myForm: FormGroup;
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    public http: Http,
    public route: ActivatedRoute,
    private fBuilder: FormBuilder,
    private alerts: AlertsService
  ) {}

  ngOnInit() {
     // Match Details
     this.merchantDetails = localStorage.getItem("EditingUser");
     let assignMerchantDetails = JSON.parse(this.merchantDetails);
    //  console.log(assignMerchantDetails);
     this.outletPhoto = assignMerchantDetails["OutletPhoto"];
     this.id = assignMerchantDetails["Id"];
     this.username = assignMerchantDetails["UserName"];
     this.cuisines = assignMerchantDetails["CuisineId"];
     this.categories = assignMerchantDetails["CategoryId"];
     this.password = assignMerchantDetails["Password"];
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
     this.acraBizFile = assignMerchantDetails["ACRABizFile"];
     this.restaurantName = assignMerchantDetails["RestaurantName"];
     this.businessLegalName = assignMerchantDetails["BusinessLegalName"];
     this.acra = assignMerchantDetails["ACRA"];
     this.registeredAddress = assignMerchantDetails["RegisteredAddress"];
     this.qr = assignMerchantDetails["QR"];
     this.country = assignMerchantDetails["Country"];
     this.postalcode = assignMerchantDetails["PostalCode"];
     this.outletAddress = JSON.parse(assignMerchantDetails["OutletAddress"]);
     this.servChargeRate = assignMerchantDetails["ServChargeRate"];
     this.numberOfOutlet = assignMerchantDetails["NoOfOutlet"];
     this.legalEntitySelection = assignMerchantDetails["LegalEntityType"];
     this.hasGST = assignMerchantDetails["HasGST"];
     this.hasCreditCard = assignMerchantDetails["HasCreditCard"];
     this.openTiming = JSON.parse(assignMerchantDetails["OpenTiming"]);

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

    // let tokenNo = localStorage.getItem("Token");
    // let getCategoriesUrl = global.host + "Categories" + "?token=" + tokenNo;
    // let getCuisinesUrl = global.host + "Cuisines" + "?token=" + tokenNo;
    // //Get Cuisine Id
    // this.http.get(getCuisinesUrl, {}).map(res => res.json()).subscribe(data => {
    //   this.cuisinesTypes = data;
    // })
    // //Get Categories Id
    // this.http.get(getCategoriesUrl, {}).map(res => res.json()).subscribe(data => {
    //   this.categoriesTypes = data;
    // })
  }

  onChangeCuisinesSelect(event){
    this.cuisines = event.target.value
  }

  onItemSelect(item: any) {
  }
  OnItemDeSelect(item: any) {
  }
  onSelectAll(items: any) {
    // console.log(items);
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

  // openTiming edit
  addMondayDurations() {
    // console.log("add");
    this.openTiming[0].OperationHourList.push(this.newMondayDuration);
    this.newMondayDuration = {};
    // this.mondayDurations.push(this.newMondayDuration);
    // this.newMondayDuration = {};
  }

  deleteMondayDurations(index) {
    this.openTiming[0].OperationHourList.splice(index, 1);
    // this.mondayDurations.splice(index, 1);
  }
  addTuesdayDurations() {
    this.openTiming[1].OperationHourList.push(this.newTuesdayDuration);
    this.newTuesdayDuration = {};
  }

  deleteTuesdayDurations(index) {
    this.openTiming[1].OperationHourList.splice(index, 1);
  }

  addWednesdayDurations() {
    this.openTiming[2].OperationHourList.push(this.newWednesdayDuration);
    this.newWednesdayDuration = {};
  }

  deleteWednesdayDurations(index) {
    this.openTiming[2].OperationHourList.splice(index, 1);
  }
  addThursdayDurations() {
    this.openTiming[3].OperationHourList.push(this.newThursdayDuration);
    this.newThursdayDuration = {};
  }

  deleteThursdayDurations(index) {
    this.openTiming[3].OperationHourList.splice(index, 1);
  }
  addFridayDurations() {
    this.openTiming[4].OperationHourList.push(this.newFridayDuration);
    this.newFridayDuration = {};
  }

  deleteFridayDurations(index) {
    this.openTiming[4].OperationHourList.splice(index, 1);
  }
  addSaturdayDurations() {
    this.openTiming[5].OperationHourList.push(this.newSaturdayDuration);
    this.newSaturdayDuration = {};
  }

  deleteSaturdayDurations(index) {
    this.openTiming[5].OperationHourList.splice(index, 1);
  }
  addSundayDurations() {
    this.openTiming[6].OperationHourList.push(this.newSundayDuration);
    this.newSundayDuration = {};
  }

  deleteSundayDurations(index) {
    this.openTiming[6].OperationHourList.splice(index, 1);
  }
  addPublicHolidayDurations() {
    this.openTiming[7].OperationHourList.push(this.newPublicHolidayDuration);
    this.newPublicHolidayDuration = {};
  }

  deletePublicHolidayDurations(index) {
    this.openTiming[7].OperationHourList.splice(index, 1);
  }
  addEveOfPH() {
    this.openTiming[8].OperationHourList.push(this.newEveOfPH);
    this.newEveOfPH = {};
  }
  deleteEveOfPH(index) {
    this.openTiming[8].OperationHourList.splice(index, 1);
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
        CuisineId: parseInt(this.cuisines),
        CategoryId: parseInt(this.categories),
        Password: this.password,
        AccountType: this.accountTypeSelection,
        Email: this.email,
        Firstname: this.firstname,
        Lastname: this.lastname,
        NRIC: this.icNumber,
        Mobile: this.mobile,
        BankName: this.bankName,
        BankAccountName: this.bankAccountName,
        BankAccountNumber: this.bankAccountNumber,
        BankStatementEmail: this.bankStatementEmail,
        RestaurantName: this.restaurantName,
        BusinessLegalName: this.businessLegalName,
        ACRA: this.acra,
        RegisteredAddress: this.registeredAddress,
        OutletAddress: JSON.stringify(this.outletAddress),
        QR: this.qr,
        NoOfOutlet: this.numberOfOutlet,
        LegalEntityType: this.legalEntitySelection,
        OpenTiming: JSON.stringify(this.openTiming),
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
    } 
    else {
      window.alert("Please fill in Username and Mobile Number");
    }
  }

  onSubmit(){
    // Input Validation for save draft
    if (this.username !== undefined && this.mobile !== undefined  && this.password !== undefined && this.country !== undefined && this.postalcode !== undefined
      && this.email !== undefined && this.firstname !== undefined && this.lastname !== undefined && this.mobile !== undefined && this.icNumber !== undefined 
      && this.legalEntitySelection !== undefined && this.bankName !== undefined && this.bankAccountName !== undefined
      && this.bankAccountNumber !== undefined && this.nricFrontImage != undefined && this.nricBackImage != undefined && this.businessLegalName !== undefined 
      && this.acra !== undefined && this.registeredAddress !== undefined && this.numberOfOutlet !== undefined && this.restaurantName !== undefined && 
      this.username !== '' && this.mobile !== ''  && this.password !== '' && this.country !== '' && this.postalcode !== ''
      && this.email !== '' && this.firstname !== '' && this.lastname !== '' && this.mobile !== '' && this.icNumber !== '' && this.legalEntitySelection !== '' 
      && this.bankName !== '' && this.bankAccountName !== '' && this.bankAccountNumber !== '' && this.nricFrontImage != '' && this.nricBackImage != '' 
      && this.businessLegalName !== '' && this.acra !== '' && this.registeredAddress !== '' && this.numberOfOutlet !== null && this.restaurantName !== '') {
      this.appInfo = {
        // "Id": (this.appInfo == null)?0:this.appInfo['Id'],
        Id: this.id,
        UserName: this.username,
        CuisineId: this.cuisines,
        CategoryId: this.categories,
        Password: this.password,
        AccountType: this.accountTypeSelection,
        Email: this.email,
        Firstname: this.firstname,
        Lastname: this.lastname,
        NRIC: this.icNumber,
        Mobile: this.mobile,
        BankName: this.bankName,
        BankAccountName: this.bankAccountName,
        BankAccountNumber: this.bankAccountNumber,
        BankStatementEmail: this.bankStatementEmail,
        RestaurantName: this.restaurantName,
        BusinessLegalName: this.businessLegalName,
        ACRA: this.acra,
        RegisteredAddress: this.registeredAddress,
        OutletAddress: JSON.stringify(this.outletAddress),
        QR: this.qr,
        NoOfOutlet: this.numberOfOutlet,
        LegalEntityType: this.legalEntitySelection,
        OpenTiming: JSON.stringify(this.openTiming),
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
                Swal({
                  position: 'center',
                  type: 'success',
                  title: "Submit Successfully",
                  showConfirmButton: false,
                  timer: 1500
                }).then(()=>{
                   // console.log(data["Message"]);
                if (this.appInfo["Status"] === "Pending") {
                  this.router.navigate(["/formes"]);
                } else {
                  this.router.navigate(["/formes"]);
                }
                })
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
