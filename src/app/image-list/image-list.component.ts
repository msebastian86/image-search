import { Component, OnInit } from '@angular/core';
import { ImageService } from '../shared/image.service';

import { timer } from 'rxjs/observable/timer';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})


export class ImageListComponent implements OnInit {

  query: string;
  queryMaxPages = 0;
  images: any[];
  imagesFound: boolean = false;
  searching: boolean = false;
  resultsPage: number = 1;
  prevButton = false;
  nextButton = false;

  lastKeypressed = 0;


  handleSuccess(data){
    this.searching = false
    this.imagesFound = true;
    this.queryMaxPages = Math.ceil(data.totalHits/4);
    this.images = data.hits;
    console.log(data.hits); //hits comes from the response - log without it
    this.paginationUpdate();
  }

  handleError(error){
    this.searching = false;
    console.log(error);
  }

  constructor(private _imageService : ImageService) { }

  paginationUpdate(){
    // check PREV button
    if (this.resultsPage > 1) { this.prevButton = true; } else { this.prevButton = false; }
    
    // check NEXT button
    if (this.queryMaxPages > this.resultsPage) { this.nextButton = true; } else { this.nextButton = false; }

    this.searching = false;
  }

  searchImages(query: string, $event){
    
    if ($event.timeStamp - this.lastKeypressed > 500) {
      this.searching = true;
      this.query = query;
      this.resultsPage = 1;

      this._imageService
      .getImages(query, this.resultsPage)
      .subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      )
      
    }

    this.lastKeypressed = $event.timeStamp;
    
  }

  loadPrev($event){
    
    if ($event.timeStamp - this.lastKeypressed > 500) {
      this.searching = true;
      if(this.prevButton) this.resultsPage--;
      this._imageService.getImages(this.query, this.resultsPage).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      )
    }
    
    this.lastKeypressed = $event.timeStamp;
  }
  
  loadNext($event){
    
    if ($event.timeStamp - this.lastKeypressed > 1000) {
      this.searching = true;
      this.resultsPage++;
      this._imageService.getImages(this.query, this.resultsPage).subscribe(
        data => this.handleSuccess(data),
        error => this.handleError(error)
      )
    }
    
    this.lastKeypressed = $event.timeStamp;
  }

  ngOnInit() {
  }

}
