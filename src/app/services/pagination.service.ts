import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class PaginationService {
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // Calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number;
    let endPage: number;

    if(totalPages <= 10){
      startPage = 1;
      endPage = totalPages;
    }
    else {
      if(currentPage <= 6){
        startPage = 1;
        endPage = 10;
      }
      else if (currentPage + 4 >= totalPages){
        startPage = totalPages - 9;
        endPage = totalPages;
      }
      else{
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    // Calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize -1, totalItems - 1);

    // Create an array of pages to ngFor in the pager control
    let pages = _.range(startPage, endPage + 1);

    // Return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
  constructor() { }
}
