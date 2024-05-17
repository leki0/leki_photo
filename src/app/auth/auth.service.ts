import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isUserAuthenticated = false;
  constructor() { }
  get isUserAuthenticated() { 
    return this._isUserAuthenticated;
  }
  prijava() {
    this._isUserAuthenticated = true;

  }

  odjava() {
    this._isUserAuthenticated = false;
  }
}
