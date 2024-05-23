import { Injectable } from '@angular/core';
import { Usluga } from '../usluga.model';
import { HttpClient } from '@angular/common/http';

interface UslugaData {
  naziv: string;
  opis: string;
}
@Injectable({
  providedIn: 'root'
})
export class UslugeService {

  usluge: Usluga[] = [{ id: "u1", nazivUsluge: "Fotografisanje rodjendana", kratakOpis: "blabla", slikaUrl: "" },
  { id: "u2", nazivUsluge: "Fotografisanje krstenja", kratakOpis: "blabla", slikaUrl: "" }];
  getUsluga(id: string) {
    return this.usluge.find((u: Usluga) => u.id == id);
  }
  constructor(private http: HttpClient) { }

  getUsluge() {
    return this.http.get<{ [key: string]: UslugaData }>(`https://leki-photo-default-rtdb.europe-west1.firebasedatabase.app/usluge.json`);
  }
  addUsluga(naziv: string, opis: string) {
    return this.http.post<{ name: string }>(`https://leki-photo-default-rtdb.europe-west1.firebasedatabase.app/usluge.json`, {
      naziv,
      opis
    });
  }
}
