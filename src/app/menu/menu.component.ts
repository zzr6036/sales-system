import { Component, OnInit } from '@angular/core';
import { HttpModule, Http, Response } from '@angular/http';
import { global } from '../global';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public http: Http, 
              route: ActivatedRoute, 
              private router: Router,) { }

  ngOnInit() {
  }

  createOnboarding(){
    this.router.navigate(['/menu/create-menu/'])
  }

}
