import { Injectable } from '@angular/core';
import { Usluga } from '../usluga.model';

@Injectable({
  providedIn: 'root'
})
export class UslugeService {

  usluge: Usluga[] = [{ id: "u1", nazivUsluge: "Fotografisanje rodjendana", kratakOpis: "blabla", slikaUrl: "" },
  { id: "u2", nazivUsluge: "Fotografisanje krstenja", kratakOpis: "blabla", slikaUrl: "" }];
  getUsluga(id: string) {
    return this.usluge.find((u:Usluga) => u.id == id);
  }
  //constructor() { }
}
