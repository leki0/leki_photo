import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../../usluge.service';

@Component({
  selector: 'app-usluga-detalji',
  templateUrl: './usluga-detalji.page.html',
  styleUrls: ['./usluga-detalji.page.scss'],
})
export class UslugaDetaljiPage implements OnInit {

  usluga: Usluga = { id: "u5", nazivUsluge: "Usluga 5", kratakOpis: "blablabla", slikaUrl: "", userId:"xx"};
  constructor(private route: ActivatedRoute, private uslugeServis: UslugeService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const uslugaId = paramMap.get('uslugaId');
      if (uslugaId !== null) {
        const foundUsluga = this.uslugeServis.getUsluga(uslugaId);
        if (foundUsluga !== undefined) {
          this.usluga = foundUsluga;
        } else {
          // Usluga nije pronađena, možete obraditi ovu situaciju na odgovarajući način
        }
      }
    });
  }
  
  

}
