import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-savedraft',
  templateUrl: './savedraft.component.html',
  styleUrls: ['./savedraft.component.scss']
})
export class SavedraftComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
