import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isUserAuthenticated = false;
  constructor() { }
  get_isUserAuthenticated() {
    return this.isUserAuthenticated;
  }
  prijava() {
    this.isUserAuthenticated = true;

  }

  odjava() {
    this.isUserAuthenticated = false;
  }
}
