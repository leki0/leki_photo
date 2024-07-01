import { Component, OnInit } from '@angular/core';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../usluge.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sacuvano',
  templateUrl: './sacuvano.page.html',
  styleUrls: ['./sacuvano.page.scss'],
  providers: [DatePipe]
})
export class SacuvanoPage implements OnInit {
  savedUsluge: Usluga[] = [];

  constructor(private uslugeService: UslugeService,    private datePipe: DatePipe) {}

  ngOnInit() {
    this.uslugeService.savedUsluge.subscribe(usluge => {
      this.savedUsluge = usluge;
    });
    

    // Get only the saved services for the current user
    this.uslugeService.getSavedUsluge().subscribe();
  }
  formatDate(dateString: string) {
    return this.datePipe.transform(dateString, 'dd/MM/yyyy');
  }
}
