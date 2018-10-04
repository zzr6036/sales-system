import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Md5 } from "ts-md5/dist/md5";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injectable } from "@angular/core";
import { Inject, Optional } from "@angular/core";
import { Headers, URLSearchParams } from "@angular/http";
import { RequestMethod, RequestOptions, RequestOptionsArgs } from "@angular/http";
import { ResponseContentType } from "@angular/http";
import { HttpModule, Http, Response } from "@angular/http";
import Swal from 'sweetalert2';
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { global } from "../../global";
import { AsyncLocalStorage } from "angular-async-local-storage";
import { AlertsService } from "angular-alert-module";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
  public Token: any;
  public roleId: Number;
  public idList: Array<any>=[];
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private httpClient: HttpClient,
    public http: Http,
    protected localStorage: AsyncLocalStorage,
    private alerts: AlertsService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });

    let username = window.localStorage.getItem("Email");
    let token = window.localStorage.getItem("Token");
    // let password = window.localStorage.getItem("Password");

    (username != null && token != null) ? this.router.navigate(["/formes"]) : this.router.navigate(["/authentication/signin"]);
  }

  onSubmit() {
    let username = this.form.get("uname").value;
    let userpassword = this.form.get("password").value;
    userpassword = btoa(String(Md5.hashAsciiStr(userpassword)).toUpperCase());
    let userInfo = { Email: username, Password: userpassword, Platform: "",RegId: ""};
    let loginUserName = userInfo.Email;
    let loginPassword = userInfo.Password;

    let getResUrl = global.host + "users/login";
    this.http.post(getResUrl, userInfo, {}).map(res => res.json()).subscribe(data => {
          // console.log(data);
          //Check username and password for login
          if (data["Message"] == undefined) {
            let result: any;
            result = JSON.parse(data["UserInfo"]);
            result.Token = data["Token"];
            let loginToken = result.Token;

            localStorage.setItem("Email", loginUserName);
            // localStorage.setItem("Password", loginPassword);
            localStorage.setItem("Token", loginToken);
            localStorage.setItem("UserInfo_Id", result.Id);
            // localStorage.setItem("UserInfo_RoleName", result.Role.Name);
            localStorage.setItem("UserInfo_Name", result.FirstName);
            this.router.navigate(["/formes"]);
          } else {
            //Alert message for invalid login
            Swal({
              position: 'center',
              type: 'warning',
              title: 'Please input the correct username and password!',
              showConfirmButton: true,
              // timer: 2000,
            })
            console.log(data["Message"]);
            this.router.navigate(["/authentication/signin"]);
          }

          let tokenNo = data["Token"];
          let roleCheckUrl = global.host + 'roles/' + '?token=' + tokenNo;
          // console.log(roleCheckUrl);
          this.roleId = JSON.parse(data["UserInfo"]).RoleId;
          this.http.get(roleCheckUrl, {}).map(res => res.json()).subscribe(data => {
            //Check roles
            let roleCheckResult = data;
            for(var i=0; i<data.length; i++){
              this.idList.push(data[i]["Id"]);
            }
            let roleName;
            for(var n=0; n<data.length; n++){
              if(this.roleId === this.idList[n]){
              roleName = roleCheckResult[n]["Name"];
              }
            }
            localStorage.setItem('RoleName', roleName);
          })
        },
        error => {
          console.log(error);
          //this.onErrorBackToLogin(error);
        }
      ); 
  }
}
