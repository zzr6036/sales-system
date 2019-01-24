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
            localStorage.setItem("Token", loginToken);
            localStorage.setItem("UserInfo_Id", result.Id);
            localStorage.setItem("UserInfo_Name", result.FirstName);
            this.roleId = JSON.parse(data["UserInfo"]).RoleId;
            this.loadRole(loginToken);
          } else {
            //Alert message for invalid login
            Swal({
              position: 'center',
              type: 'warning',
              title: 'Please input the correct username and password!',
              text: data["Message"],
              showConfirmButton: true,
              // timer: 2000,
            })
            console.log(data["Message"]);
            window.localStorage.clear();
            this.router.navigate(["/authentication/signin"]);
          }
        },
        error => {
          console.log(error);
          Swal({
            position: 'center',
            type: 'warning',
            title: "Error Status: "+error.status,
            text: error.statusText,
            showConfirmButton: true,
            // timer: 2000,
          })
          //this.onErrorBackToLogin(error);
        }
      ); 
  }

  loadRole(inToken){
    let roleCheckUrl = global.host + 'roles/' + '?token=' + inToken;
    this.http.get(roleCheckUrl, {}).map(resp => resp.json()).subscribe(data2 => {
      //Check roles
      if (data2["Message"] == undefined) {
        this.idList = [];
        // console.log(data2)
        let roleCheckResult = data2;
        for(var i=0; i<data2.length; i++){
          this.idList.push(data2[i]["Id"]);
        }
        let roleName;
        for(var n=0; n<data2.length; n++){
          if(this.roleId === this.idList[n]){
          roleName = roleCheckResult[n]["Name"];
          }
        }
        localStorage.setItem('RoleName', roleName);
        this.router.navigate(["/formes"]);
      }
      else{
        Swal({
          position: 'center',
          type: 'warning',
          title: data2["Message"],
          showConfirmButton: true,
          // timer: 2000,
        })
        window.localStorage.clear();
        this.router.navigate(["/authentication/signin"]);
      }
    },
    error => {
      console.log(error);
      Swal({
        position: 'center',
        type: 'warning',
        title: "Error Status: "+error.status,
        text: error.statusText,
        showConfirmButton: true,
        // timer: 2000,
      })
      //this.onErrorBackToLogin(error);
    });
  }
}
