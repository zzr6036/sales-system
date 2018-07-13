import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(accounts: any, term: any): any {
    if (term === undefined) return accounts;

    return accounts.filter(function(searchResult) {
        return searchResult.name.toLowerCase().includes(term.toLowerCase());
    })
}
  // transform(items: any[], field: string, value: string): any[] {
  //   if (!items) {
  //     return [];
  //   }
  //   if (!field || !value) {
  //     return items;
  //   }
  //   return items.filter(singleItem =>
  //     singleItem[field].toLowerCase().includes(value.toLowerCase())
  //   );
  // }
}
