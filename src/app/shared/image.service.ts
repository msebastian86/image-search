import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class ImageService{
    private API_KEY: string = environment.PIXABAY_API_KEY;
    private API_URL: string = environment.PIXABAY_API_URL;
    private URL: string = this.API_URL + this.API_KEY + '&q=';

    private query: string;
    private gallerySize: number = 12;
    private resultsPage: number;
    
    constructor(private _http: HttpClient ){ }

    getImages(query, resultsPage){
        return this._http.get(this.URL + query + '&per_page=' + this.gallerySize + '&page=' + resultsPage);
    }
}