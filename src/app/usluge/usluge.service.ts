import { Injectable } from '@angular/core';
import { Usluga } from '../usluga.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';

interface UslugaData {
  naziv: string;
  opis: string;
}
@Injectable({
  providedIn: 'root'
})
export class UslugeService {

  private _usluge = new BehaviorSubject<Usluga[]>([]);

  oldUsluge = [{ id: "u1", nazivUsluge: "Fotografisanje rodjendana", kratakOpis: "blabla", slikaUrl: "" },
  { id: "u2", nazivUsluge: "Fotografisanje krstenja", kratakOpis: "blabla", slikaUrl: "" }];

  constructor(private http: HttpClient) { }

  get usluge() {
    return this._usluge.asObservable();
  }

  addUsluga(nazivUsluge: string, kratakOpis: string) {
    let generatedId: string;
    let novaUsluga:Usluga;


    return this.http.post<{ name: string }>(`https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge.json`, {
      nazivUsluge,
      kratakOpis
    }).pipe(switchMap((resData) => {

      generatedId = resData.name;
      return this.usluge;
    }), take(1), tap((usluge) => {
      this._usluge.next(usluge.concat({
        id: generatedId,
        nazivUsluge,
        kratakOpis,
        slikaUrl: "https://img.myloview.com/stickers/camera-with-flash-icon-elements-of-camera-icon-for-concept-and-web-apps-illustration-icon-for-website-design-and-development-app-development-premium-icon-400-111926464.jpg"
      }));
    }));
  }
  getUsluge() {
    return this.http.
      get<{ [key: string]: UslugaData }>(`https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge.json`)
      .pipe(map((uslugeData) => {
        const usluge: Usluga[] = [];
        for (const key in uslugeData) {
          if (uslugeData.hasOwnProperty(key)) {
            usluge.push({
              id: key,
              nazivUsluge: uslugeData[key].naziv,
              kratakOpis: uslugeData[key].opis,
              slikaUrl: "https://img.myloview.com/stickers/camera-with-flash-icon-elements-of-camera-icon-for-concept-and-web-apps-illustration-icon-for-website-design-and-development-app-development-premium-icon-400-111926464.jpg"
            })
          }
        }

        return usluge;
      }), tap(usluge => {
        this._usluge.next(usluge);
      })
      );
  }

  getUsluga(id: string) {
    return this.oldUsluge.find((u) => u.id == id)
  }
}
