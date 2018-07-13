import { Component, OnInit } from '@angular/core';
import { global } from '../global';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpModule, Http, Response } from '@angular/http';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {
  salesDetails = [{Name: "Olivia", Mobile: "98765432", Amount: 100000},
                  {Name: "Ruby", Mobile: "98765432", Amount: 140000},
                  {Name: "Emily", Mobile: "98765432", Amount: 90000},
                  {Name: "Grace", Mobile: "98765432", Amount: 250000},]

  constructor(public http: Http, 
              route: ActivatedRoute, 
              private router: Router) { }

  ngOnInit() {
  }

  viewSalesInto(){
    this.router.navigate(['/dashboards/view-sales'])
  }

}
