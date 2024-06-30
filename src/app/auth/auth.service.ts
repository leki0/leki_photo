import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Korisnik } from './korisnik.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, tap } from 'rxjs/operators';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

interface UserData {
  ime?: string;
  prezime?: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isUserAuthenticated = false;
  private _user = new BehaviorSubject<Korisnik | null>(null);

  constructor(private http: HttpClient) {}

  get isUserAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  get userRole() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.role;
        } else {
          return null;
        }
      })
    );
  }

  registracija(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true })
      .pipe(tap((userData) => {
        const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
        const userRole = this.getRole(user.email);
        const korisnik = new Korisnik(userData.localId, userData.email, userData.idToken, expirationTime, userRole);
        this._user.next(korisnik);
      }));
  }

  prijava(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    ).pipe(tap((userData) => {
      const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
      const userRole = this.getRole(user.email);
      const korisnik = new Korisnik(userData.localId, userData.email, userData.idToken, expirationTime, userRole);
      this._user.next(korisnik);
    }));
  }

  odjava() {
    this._user.next(null);
  }

  private getRole(email: string): string {
    const adminEmail = 'aleksa@gmail.com'; 
    return email === adminEmail ? 'admin' : 'user';
  }
}
