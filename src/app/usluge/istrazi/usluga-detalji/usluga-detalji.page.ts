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
  usluga: Usluga | undefined;

  constructor(
    private route: ActivatedRoute,
    private uslugeServis: UslugeService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const uslugaId = paramMap.get('uslugaId');
      if (uslugaId !== null) {
        this.uslugeServis.getUsluga(uslugaId).subscribe(foundUsluga => {
          this.usluga = foundUsluga;
          if (!foundUsluga) {
            console.error('Usluga nije pronađena!');
          }
        });
      }
    });
  }
}
