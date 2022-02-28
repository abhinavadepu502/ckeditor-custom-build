import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPublishPayload } from './models/IPublishPayload';

@Injectable({
  providedIn: 'root'
})
export class PublishService {
  _serviceUrl = "";
  constructor(private _httpClient : HttpClient) { }

  public submitMeta(payload : IPublishPayload) {
    return this._httpClient.post(this._serviceUrl, payload);
  }
  
}
