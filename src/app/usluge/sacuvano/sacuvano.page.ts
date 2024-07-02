import { Component, OnInit } from '@angular/core';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../usluge.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sacuvano',
  templateUrl: './sacuvano.page.html',
  styleUrls: ['./sacuvano.page.scss'],
  providers: [DatePipe]
})
export class SacuvanoPage implements OnInit {
  savedUsluge: Usluga[] = [];
  isModalOpen = false;
  selectedTermin: Usluga | null = null;
  userRole: string | null = null;

  constructor(
    private uslugeService: UslugeService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.uslugeService.savedUsluge.subscribe(usluge => {
      this.savedUsluge = usluge;
    });

    this.uslugeService.getSavedUsluge().subscribe();

    this.authService.userRole.subscribe(role => {
      this.userRole = role;
    });
  }

  formatDate(dateTimeString: string) {
    return this.datePipe.transform(dateTimeString, 'dd/MM/yyyy HH:mm');
  }

  openModal(termin: Usluga) {
    this.selectedTermin = termin;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
