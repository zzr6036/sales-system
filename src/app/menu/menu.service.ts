import { Injectable } from "@angular/core";
import { HttpModule, Http, Response } from "@angular/http";
import { global } from "../global";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { Md5 } from "ts-md5/dist/md5";
import { MenuView } from "./menu-view.model";
import Swal from "sweetalert2";


@Injectable()
export class MenuService {
  selectedMenu: MenuView = new MenuView();

  constructor(
    public http: Http,
    public route: ActivatedRoute,
    private router: Router
  ) {}
}