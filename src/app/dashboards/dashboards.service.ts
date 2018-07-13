import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpModule, Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Chart } from 'chart.js';

@Injectable()
export class DashboardsService {

    constructor(private http: HttpClient,public route: ActivatedRoute, private router: Router){}

    viewSalesDetail(){
        let viewSalesUrl = `https://data.gov.sg/api/action/datastore_search?resource_id=2403315c-93b9-4f65-b97b-8132077037eb&limit=5`;
        
         this.http.get(viewSalesUrl, {}).subscribe(data =>{
            // console.log(data);
            let totalIncome = data["result"]["records"].map(res => res.total_income);
            let yearOfAssessment = data["result"]["records"].map(res => res.year_of_assessment);

            // let salesYears =[]
            // yearOfAssessment.forEach((res) => {
            //     let jsdate = new Date(res * 1000)
            //     yearOfAssessment.push(jsdate.toLocaleDateString('en', {year: 'numeric', month:'short', day:'numeric'}))
            // });

            // this.chart = new Chart('canvas', {
            //     type: 'line',
            //     data: {
            //         labels: yearOfAssessment,
            //         datasets:[
            //             {
            //                 data: totalIncome,
            //                 borderColor: "#3cba9f",
            //                 fill: false
            //             }
            //         ]
            //     },
            //     options: {
            //         legend: {
            //             display: false
            //         },
            //         scales: {
            //             xAxes: [{
            //                 display: true
            //             }],
            //             yAxes: [{
            //                 display: true
            //             }],
            //         }
            //     }
            // });
            console.log(yearOfAssessment);
            console.log(totalIncome);
            
        })
        // this.http.get(viewSalesUrl, {}).map(res => res.json()).subscribe(data =>{
        //     console.log(data);
        // })
        
    }
}