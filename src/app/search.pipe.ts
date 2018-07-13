import { Injectable, Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: "search"
})
// @Injectable()
export class SearchPipe implements PipeTransform {
  transform(accounts: any[], RestaurantName: string, value: string): any[] {
    if (!accounts) {
      return [];
    }
    if (!RestaurantName || !value) {
      return accounts;
    }

    return accounts.filter(account =>
        account[RestaurantName].toLowerCase().includes(value.toLowerCase())
    );
  }
}
