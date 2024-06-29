import { Injectable } from '@angular/core';
import { Usluga } from '../usluga.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface UslugaData {
  nazivUsluge: string;
  kratakOpis: string;
  slikaUrl: string;
  userId: string;
  //rekla je da ovaj interfejs ce vracati nesto
}
@Injectable({
  providedIn: 'root'
})
export class UslugeService {

  private _usluge = new BehaviorSubject<Usluga[]>([]);
  private _savedUsluge = new BehaviorSubject<Usluga[]>([]);
  get savedUsluge() {
    return this._savedUsluge.asObservable();
  }

  saveUsluga(usluga: Usluga) {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user ID found!');
        }
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http.post<{ name: string }>(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/savedUsluge.json?auth=${token}`, usluga);
      }),
      switchMap(() => {
        return this.savedUsluge;
      }),
      take(1),
      tap((savedUsluge) => {
        this._savedUsluge.next(savedUsluge.concat(usluga));
      })
    );
  }

  getSavedUsluge() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: Usluga }>(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/savedUsluge.json?auth=${token}`);
      }),
      map((savedUslugeData) => {
        const savedUsluge: Usluga[] = [];
        for (const key in savedUslugeData) {
          if (savedUslugeData.hasOwnProperty(key)) {
            savedUsluge.push(new Usluga(
              key,
              savedUslugeData[key].nazivUsluge,
              savedUslugeData[key].kratakOpis,
              savedUslugeData[key].slikaUrl,
              savedUslugeData[key].userId
            ));
          }
        }
        return savedUsluge;
      }),
      tap(savedUsluge => {
        this._savedUsluge.next(savedUsluge);
      })
    );
  }

  oldUsluge: Usluga[] = [{ id: "u1", nazivUsluge: "Fotografisanje rodjendana", kratakOpis: "blabla", slikaUrl: "", userId: "x" },
  { id: "u2", nazivUsluge: "Fotografisanje krstenja", kratakOpis: "blabla", slikaUrl: "", userId: "xc" }];

  constructor(private http: HttpClient, private authService: AuthService) { }

  get usluge() {
    return this._usluge.asObservable();
  }

  addUsluga(nazivUsluge: string, kratakOpis: string) {
    let generatedId: string;
    let novaUsluga: Usluga;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user ID found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        novaUsluga = new Usluga(
          '',
          nazivUsluge,
          kratakOpis,
          "https://img.myloview.com/stickers/camera-with-flash-icon-elements-of-camera-icon-for-concept-and-web-apps-illustration-icon-for-website-design-and-development-app-development-premium-icon-400-111926464.jpg",
          fetchedUserId
        );
        console.log('Nova usluga pre slanja:', novaUsluga);
        return this.http.post<{ name: string }>(
          `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge.json?auth=${token}`,
          novaUsluga
        );
      }),
      take(1),
      switchMap(resData => {
        generatedId = resData.name;
        console.log('Generisani ID:', generatedId);
        novaUsluga.id = generatedId;
        return this.authService.token.pipe(
          take(1),
          switchMap(token => {
            return this.http.patch(
              `https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge/${generatedId}.json?auth=${token}`,
              { id: generatedId }
            );
          }),
          take(1),
          switchMap(() => this.usluge),
          take(1)
        );
      }),
      tap(usluge => {
        console.log('Nova usluga sa generisanim ID-em:', novaUsluga);
        this._usluge.next(usluge.concat(novaUsluga));
      })
    );
  }
  getUsluge() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.
          get<{ [key: string]: UslugaData }>(`https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge.json?auth=${token}`)
      }),
      map((uslugeData) => {
        console.log('Podaci primljeni iz baze:', uslugeData);
        const usluge: Usluga[] = [];
        for (const key in uslugeData) {
          if (uslugeData.hasOwnProperty(key)) {
            usluge.push(new Usluga(
              key,
              uslugeData[key].nazivUsluge,
              uslugeData[key].kratakOpis,
              uslugeData[key].slikaUrl,
              uslugeData[key].userId
            )

            )
          }
        }

        return usluge;
      }), tap(usluge => {
        this._usluge.next(usluge);
      })
    )

  }

  getUsluga(id: string): Observable<Usluga | undefined> {
    return this.usluge.pipe(
      take(1),
      map(usluge => usluge.find(usluga => usluga.id === id))
    );
  }
}