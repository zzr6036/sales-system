import { Component, OnInit, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { global } from "../../global";
import { NgModel } from "@angular/forms";
import { stringify } from "@angular/compiler/src/util";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbDateStruct, NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { FormControl } from "@angular/forms";

import { SpecialpromotionView } from '../specialpromotion-view.model';
import { SpecialpromotionService } from '../specialpromotion.service';

@Component({
  selector: 'app-specialpromotion-code',
  templateUrl: './specialpromotion-code.component.html',
  styleUrls: ['./specialpromotion-code.component.scss']
})
export class SpecialpromotionCodeComponent implements OnInit {
  specialPromotionDetail: SpecialpromotionView = new SpecialpromotionView();

  show: Boolean = false;
  buttonName: any = "Assign to Merchant";

  constructor(public http: Http,
              private router: Router,
              public route: ActivatedRoute,
              private specialpromotionService: SpecialpromotionService) { }

  ngOnInit() {
  }

  toggle() {
    this.show = !this.show;
    if(this.show){
      this.buttonName = "Not Assign to Merchant";
    }
    else {
      this.buttonName = "Assign to Merchant";
    }
  }

  addSpecialPromotion(){
    this.specialpromotionService.addSpecialPromotion(this.specialPromotionDetail);
  }

}
