import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, Response } from '@angular/http';
import { global } from '../../global';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http/src/base_request_options';
import { PromotionService } from './../promotion.service';

@Component({
  selector: 'app-promotion-userlist',
  templateUrl: './promotion-userlist.component.html',
  styleUrls: ['./promotion-userlist.component.scss']
})
export class PromotionUserlistComponent implements OnInit {
  userPromotionUses: Array<any> = [];
  userPromoDetails: any;
  userPromoView:any;

  constructor(public http: Http,
              route: ActivatedRoute,
              private router: Router,
              private promotionService: PromotionService) { }

  ngOnInit() {
     let tokenNo = localStorage.getItem("Token");
     let getPromUsedUrl = global.host + "userpromoused" + "?token=" + tokenNo;
    // let getPromUsedUrl = `http://xindotsbackend.azurewebsites.net/_xin/api/userpromoused/?token=${localStorage.getItem("Token")}`;
    this.userPromoDetails = localStorage.getItem("viewPromoCode");
    let assignUserPromoDetails = JSON.parse(this.userPromoDetails);
    // console.log(assignUserPromoDetails);
    let promoCodeId = assignUserPromoDetails["Id"];
    // console.log(promoCodeId)
    this.http.get(getPromUsedUrl, {}).map(res => res.json()).subscribe(data => {
      // console.log(data);
      for(var i=0; i<data.length; i++){
        if(data[i]["PromoId"] === promoCodeId){
          this.userPromotionUses.push(data[i]);
          // console.log(typeof(this.userPromotionUses));
        }
      }
    })
  }
}
