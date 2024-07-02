import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Korisnik } from './korisnik.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

export interface UserData {
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
  private _userData = new BehaviorSubject<UserData | null>(null);
  private users: UserData[] = []; // Lista korisnika

  constructor(private http: HttpClient) { }

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

  get currentUser(): Observable<UserData | null> {
    return this._userData.asObservable();
  }

  registracija(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true })
      .pipe(tap((userData) => {
        console.log('User registration data:', userData); // Log response data
        const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
        const userRole = this.getRole(user.email);
        const korisnik = new Korisnik(userData.localId, userData.email, userData.idToken, expirationTime, userRole, user.ime, user.prezime);
        this._user.next(korisnik);
        this._userData.next({ ...user, ime: user.ime, prezime: user.prezime }); // Save UserData with real names
        this.users.push({ ...user, ime: user.ime, prezime: user.prezime }); // Save user in local list
        console.log('Saved user data:', { ...user, ime: user.ime, prezime: user.prezime }); // Log saved user data
      }));
  }

  prijava(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    ).pipe(tap((userData) => {
      console.log('User login data:', userData); // Log response data
      const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
      const userRole = this.getRole(user.email);
      const registeredUser = this.users.find(u => u.email === user.email); // Find user in local list
      const korisnik = new Korisnik(userData.localId, userData.email, userData.idToken, expirationTime, userRole, registeredUser?.ime, registeredUser?.prezime);
      this._user.next(korisnik);
      this._userData.next({ ...user, ime: registeredUser?.ime, prezime: registeredUser?.prezime }); // Save UserData with real names
      console.log('Saved user data:', { ...user, ime: registeredUser?.ime, prezime: registeredUser?.prezime }); // Log saved user data
    }));
  }

  private getRole(email: string): string {
    if (email === 'aleksa@gmail.com') {
      return 'admin';
    } else {
      return 'user';
    }
  }
}
