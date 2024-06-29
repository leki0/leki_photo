import { Component, OnInit } from '@angular/core';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../usluge.service';

@Component({
  selector: 'app-sacuvano',
  templateUrl: './sacuvano.page.html',
  styleUrls: ['./sacuvano.page.scss'],
})


export class SacuvanoPage implements OnInit {
  savedUsluge: Usluga[] = [];

  constructor(private uslugeService: UslugeService) { }

  ngOnInit() {
    this.uslugeService.savedUsluge.subscribe(usluge => {
      this.savedUsluge = usluge;
    });

    this.uslugeService.getSavedUsluge().subscribe();
  }
}

