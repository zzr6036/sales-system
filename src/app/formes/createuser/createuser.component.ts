import {Component,OnInit,Injectable,Inject,Optional,CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {FormBuilder,FormGroup,Validators,FormControl,FormsModule,ReactiveFormsModule,NgModel, FormArray} from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {Headers,URLSearchParams,RequestMethod,RequestOptions,RequestOptionsArgs,ResponseContentType,HttpModule,Http,Response} from "@angular/http";
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
import Swal from 'sweetalert2';
import { log } from "util";

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
  registeredAddress: string;
  numberOfOutlet: number;
  qr: number;
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
  // otherDocuments: Array<any> = [{Document:""}];

  hasGST: boolean = false;
  hasCreditCard: boolean = false;
  servChargeRate: number;

  isDraft: boolean;
  loaded = false;
  autosaveTimer = null;
  status: string;

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
  public mondayDurations = [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newMondayDuration: any = {};

  public tuesdayDurations = [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newTuesdayDuration: any = {};

  public wednesdayDurations = [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newWednesdayDuration: any = {};

  public thursdayDurations = [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newThursdayDuration: any = {};

  public fridayDurations = [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newFridayDuration: any = {};

  public saturdayDurations =  [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newSaturdayDuration: any = {};

  public sundayDurations = [{OpenTime:"08:00", CloseTime:"22:00"}];
  public newSundayDuration: any = {};

  public publicHolidayDurations = [{OpenTime:"08:00", CloseTime:"22:00"}];
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

  onItemSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedSubscriptionsItems);
  }
  OnItemDeSelect(item: any) {
    // console.log(item);
    // console.log(this.selectedSubscriptionsItems);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onDeSelectAll(items: any) {
    // console.log(items);
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
    this.mondayDurations.push(this.newMondayDuration);
    this.newMondayDuration = {};
    // console.log(this.mondayDurations);
  }

  deleteMondayDurations(index) {
    this.mondayDurations.splice(index, 1);
    // console.log(this.mondayDurations);
  }
  addTuesdayDurations() {
    this.tuesdayDurations.push(this.newTuesdayDuration);
    this.newTuesdayDuration = {};
  }

  deleteTuesdayDurations(index) {
    this.tuesdayDurations.splice(index, 1);
  }

  addWednesdayDurations() {
    this.wednesdayDurations.push(this.newWednesdayDuration);
    this.newWednesdayDuration = {};
  }

  deleteWednesdayDurations(index) {
    this.wednesdayDurations.splice(index, 1);
  }
  addThursdayDurations() {
    this.thursdayDurations.push(this.newThursdayDuration);
    this.newThursdayDuration = {};
  }

  deleteThursdayDurations(index) {
    this.thursdayDurations.splice(index, 1);
  }
  addFridayDurations() {
    this.fridayDurations.push(this.newFridayDuration);
    this.newFridayDuration = {};
  }

  deleteFridayDurations(index) {
    this.fridayDurations.splice(index, 1);
  }
  addSaturdayDurations() {
    this.saturdayDurations.push(this.newSaturdayDuration);
    this.newSaturdayDuration = {};
  }

  deleteSaturdayDurations(index) {
    this.saturdayDurations.splice(index, 1);
  }
  addSundayDurations() {
    this.sundayDurations.push(this.newSundayDuration);
    this.newSundayDuration = {};
  }

  deleteSundayDurations(index) {
    this.sundayDurations.splice(index, 1);
  }
  addPublicHolidayDurations() {
    this.publicHolidayDurations.push(this.newPublicHolidayDuration);
    this.newPublicHolidayDuration = {};
  }

  deletePublicHolidayDurations(index) {
    this.publicHolidayDurations.splice(index, 1);
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

  // Save and Submit
  saveDraft(inIsDraft) {

    // Input Validation for save draft
    if (this.mobile !== undefined && this.username !== undefined) {
      this.appInfo = {
        // "Id": (this.appInfo == null)?0:this.appInfo['Id'],
        Id: this.id,
        UserName: this.username,
        Password: this.password,
        AccountType: this.accountTypeSelection,
        Email: this.email,
        Firstname: this.firstname,
        Lastname: this.lastname,
        NRIC: this.icNumber,
        Mobile: "+65-"+this.mobile,
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
        QR: this.qr,
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
        Status: "draft",
      };
      let tokenNo = localStorage.getItem("Token");
      let getResUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      let isExistingUser = this.appInfo["Id"] > 0;

      //Checking existing username
      let boardingGetUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      this.http.get(boardingGetUrl, {}).map(res => res.json()).subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            if (this.username === data[i]["UserName"]) {
              window.alert("User already in used");
            }
          }
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
        });
    } else {
      window.alert("Please fill in Username and Mobile Number");
    }
  }

  onSubmit(){
    // Input Validation for save draft
    if (this.username !== undefined && this.mobile !== undefined  && this.password !== undefined 
    && this.email !== undefined && this.firstname !== undefined && this.lastname !== undefined && this.mobile !== undefined && this.icNumber !== undefined 
    && this.legalEntitySelection !== undefined && this.bankName !== undefined && this.bankAccountName !== undefined 
    && this.bankAccountNumber !== undefined && this.nricFrontImage != undefined && this.nricBackImage != undefined && this.businessLegalName !== undefined 
    && this.acra !== undefined && this.registeredAddress !== undefined && this.numberOfOutlet !== undefined && this.restaurantName !== undefined && 
    this.username !== '' && this.mobile !== ''  && this.password !== ''
    && this.email !== '' && this.firstname !== '' && this.lastname !== '' && this.mobile !== '' && this.icNumber !== '' && this.legalEntitySelection !== '' 
    && this.bankName !== '' && this.bankAccountName !== '' && this.bankAccountNumber !== '' && this.nricFrontImage != '' && this.nricBackImage != '' 
    && this.businessLegalName !== '' && this.acra !== '' && this.registeredAddress !== '' && this.numberOfOutlet !== null && this.restaurantName !== '') {
      this.appInfo = {
        // "Id": (this.appInfo == null)?0:this.appInfo['Id'],
        Id: this.id,
        UserName: this.username,
        Password: this.password,
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
        QR: this.qr,
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
        Status: "pending",
      };
      let tokenNo = localStorage.getItem("Token");
      let getResUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      let isExistingUser = this.appInfo["Id"] > 0;

      //Checking existing username
      let boardingGetUrl = global.host + "merchantinfoes" + "?token=" + tokenNo;
      this.http.get(boardingGetUrl, {}).map(res => res.json()).subscribe(data => {
          for (var i = 0; i < data.length; i++) {
            if (this.username === data[i]["UserName"]) {
              window.alert("User already in used");
            }
          }
          let httpCall = isExistingUser ? this.http.post(getResUrl, this.appInfo, {}): this.http.post(getResUrl, this.appInfo, {});
          httpCall.map(res => res.json()).subscribe(data => {
              // console.log(data);
              if (data["Message"] == undefined) {
                Swal({
                  position: 'center',
                  type: 'success',
                  title: 'Submit Successfully!',
                  showConfirmButton: false,
                  timer: 1500
                }).then(()=>{
                if (this.appInfo["Status"] === "Pending" || this.appInfo["Status"] === "pending") {
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
