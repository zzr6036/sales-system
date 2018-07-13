import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  template: '<router-outlet></router-outlet>'
})
export class AuthLayoutComponent {

  constructor(private router: Router) { }

  ngOnInit(): void {

    // console.log("hi")

    // let a = window.localStorage.getItem("test");

    // console.log(a)

    //check if login
    this.router.navigate(['/authentication/signin']);

  }

}
