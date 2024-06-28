import { Injectable } from '@angular/core';
import { Usluga } from '../usluga.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface UslugaData {
  naziv: string;
  opis: string;
  imgUrl: string;
  userId: string;
  //rekla je da ovaj interfejs ce vracati nesto
}
@Injectable({
  providedIn: 'root'
})
export class UslugeService {

  private _usluge = new BehaviorSubject<Usluga[]>([]);

  oldUsluge = [{ id: "u1", nazivUsluge: "Fotografisanje rodjendana", kratakOpis: "blabla", slikaUrl: "" },
  { id: "u2", nazivUsluge: "Fotografisanje krstenja", kratakOpis: "blabla", slikaUrl: "" }];

  constructor(private http: HttpClient, private authService: AuthService) { }

  get usluge() {
    return this._usluge.asObservable();
  }

  addUsluga(nazivUsluge: string, kratakOpis: string) {
    let generatedId: string;
    let novaUsluga: Usluga;
    let fetchedUserId:string;
    return this.authService.userId.pipe(take(1), switchMap(userId => {

      if (!userId) {
        throw new Error('No user ID found!');
      }
      fetchedUserId=userId;
      return this.authService.token;
      
    }),
      take(1),
      switchMap((token)=>{
        novaUsluga = new Usluga('',
          nazivUsluge,
          kratakOpis,
          "https://img.myloview.com/stickers/camera-with-flash-icon-elements-of-camera-icon-for-concept-and-web-apps-illustration-icon-for-website-design-and-development-app-development-premium-icon-400-111926464.jpg",
          fetchedUserId);
        return this.http.post<{ name: string }>(`https://lekiphoto-e1777-default-rtdb.europe-west1.firebasedatabase.app/usluge.json?auth=${token}`, novaUsluga)
      }),
      take(1),
      switchMap((resData) => {

        generatedId = resData.name;
        return this.usluge;
      }),
      take(1),
      tap((usluge) => {
        novaUsluga.id = generatedId;
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
        const usluge: Usluga[] = [];
        for (const key in uslugeData) {
          if (uslugeData.hasOwnProperty(key)) {
            usluge.push(new Usluga(
              key,
              uslugeData[key].naziv,
              uslugeData[key].opis,
              uslugeData[key].imgUrl,
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

  getUsluga(id: string) {
    return this.oldUsluge.find((u) => u.id === id)
  }
}
