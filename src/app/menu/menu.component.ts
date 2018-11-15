import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, Response } from '@angular/http';
import { global } from '../global';
import { Router, ActivatedRoute } from '@angular/router';
// import { window } from 'rxjs/operators/window';
import { Observable } from 'rxjs/Rx';
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  merchantInfoes: Array<any> = [];

  constructor(public http: Http, 
              route: ActivatedRoute, 
              private router: Router,) { }

  ngOnInit() {
    let token = localStorage.getItem("Token");
    let getOfflineMerchantUrl = global.host + "merchantinfoes" + "?token=" + token;
    this.http.get(getOfflineMerchantUrl, {}).map(res => res.json()).subscribe(datas => {
      // console.log(datas)
      if(datas['Message']){
        console.log(datas['Message']);
      }
      else {
        for(var i=0; i<datas.length; i++){
          if(datas[i].Status == 'offline'){
            this.merchantInfoes.push(datas[i]);
          }
        }
      }
    }, error => {
      console.log(error);
    })
  }

  createOnboarding(){
    this.router.navigate(['/menu/create-menu/'])
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

}
