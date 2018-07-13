import { Injectable } from '@angular/core';
import { HttpModule, Http, Response } from '@angular/http';
import { global } from '../global';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { SpecialpromotionView } from './specialpromotion-view.model';
import { addDays } from 'date-fns';

@Injectable()
export class SpecialpromotionService {
    selectedSpecialPromotionCode: SpecialpromotionView;

    constructor(public http: Http,
                public route: ActivatedRoute,
                private router: Router){}

    // Create Special Promotion Code, -- Specialpromotion-code component
addSpecialPromotion(promotion: any){
    const specPromInfo = {
        "Id": promotion.Id,
        "Code": promotion.Code,
        "StartTime": promotion.StartTime,
        "EndTime": promotion.EndTime,
        "Qty": promotion.Qty,
        "MerchantId": promotion.MerchantId,
        "IsPercent": promotion.IsPercent,
        "IsJoint": promotion.IsJoint,
        "IsSpecial": promotion.IsSpecial,
        "MaxRedemptPerUser":promotion.MaxRedemptPerUser,
        "Amount": promotion.Amount,
        "MinUsed": promotion.MinUsed,
        "MaxDiscount": promotion.MaxDiscount,
        "Title": promotion.Title,
        "Description": promotion.Description,
        "Description2": promotion.Description2,
    }
    let tokenNo = localStorage.getItem("Token");
    let addUrl = global.host + 'addcode' + '?token=' +tokenNo;
    this.http.post(addUrl, specPromInfo, {}).map(res => res.json()).subscribe(data => {
        if(data["Message"] == undefined){
            this.router.navigate(["/specialpromotion"]);
        }
        else{
            console.log(data["Message"]);
        }
    }, error=>{
        console.log(error);
    });
}
}

