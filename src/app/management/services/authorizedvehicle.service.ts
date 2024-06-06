import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpBaseService} from "../../shared/services/http-base.service";
import {Authorizedvehicle} from "../models/authorizedvehicle";

@Injectable({
  providedIn: 'root'
})
export class AuthorizedvehicleService extends HttpBaseService<Authorizedvehicle> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/authorized-vehicle';
  }
}
