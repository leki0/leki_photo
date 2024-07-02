import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Korisnik } from './korisnik.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map, switchMap, take, tap } from 'rxjs/operators';
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
      .pipe(
        tap((userData) => {
          const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
          const role = this.getRole(user.email);
          const korisnik = new Korisnik(userData.localId, userData.email, userData.idToken, expirationTime, role, user.ime, user.prezime);
  
          this._user.next(korisnik);
          this.saveUserToDatabase(korisnik).subscribe(() => {
            this._userData.next({ ...user, ime: user.ime, prezime: user.prezime, role });
          });
        })
      );
  }
  
  
  private saveUserToDatabase(korisnik: Korisnik) {
    return this.token.pipe(
      take(1),
      switchMap(token => {
        if (!token) {
          throw new Error('Token is null');
        }
        const userData = {
          id: korisnik.id,
          email: korisnik.email,
          ime: korisnik.ime,
          prezime: korisnik.prezime
        };
        return this.http.put(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/users/${korisnik.id}.json?auth=${token}`,
          userData
        );
      })
    );
  }
  
  private fetchUserFromDatabase(userId: string) {
    return this.token.pipe(
      take(1),
      switchMap(token => {
        if (!token) {
          throw new Error('Token is null');
        }
        return this.http.get(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${token}`
        );
      })
    );
  }

  prijava(user: UserData) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
      { email: user.email, password: user.password, returnSecureToken: true }
    ).pipe(
      switchMap((userData) => {
        const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
        const korisnik = new Korisnik(userData.localId, userData.email, userData.idToken, expirationTime, 'user');
  
        this._user.next(korisnik);
  
        return this.fetchUserFromDatabase(userData.localId).pipe(
          tap((fetchedUser: any) => {
            const role = this.getRole(userData.email);
            const updatedKorisnik = new Korisnik(
              userData.localId,
              userData.email,
              userData.idToken,
              expirationTime,
              role,
              fetchedUser.ime,
              fetchedUser.prezime
            );
  
            this._user.next(updatedKorisnik);
            this._userData.next({ email: user.email, password: user.password, ime: fetchedUser.ime, prezime: fetchedUser.prezime, role });
          })
        );
      })
    );
  }
  
  

  private getRole(email: string): string {
    if (email === 'aleksa@gmail.com') {
      return 'admin';
    } else {
      return 'user';
    }
  }
}
