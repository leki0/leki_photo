import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../../usluge.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-usluga-detalji',
  templateUrl: './usluga-detalji.page.html',
  styleUrls: ['./usluga-detalji.page.scss'],
})
export class UslugaDetaljiPage implements OnInit {
  usluga: Usluga | undefined;
  datumZakazivanja: string | undefined;
  userRole: string | null = null;
  editMode = false;
  selectedImage: File | null = null;
  isPopoverOpen = false; // Promenljiva za upravljanje popoverom

  constructor(
    private route: ActivatedRoute,
    private uslugeServis: UslugeService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

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

    this.authService.userRole.subscribe(role => {
      this.userRole = role;
    });
  }

  openDatePicker() {
    this.isPopoverOpen = true;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  confirmDate() {
    this.closePopover();

  }

  async onZakazi() {
    if (!this.datumZakazivanja) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Datum zakazivanja nije odabran!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    if (this.usluga && this.datumZakazivanja) {
      // Formatiramo datum na ISO format
      const dateToBook = new Date(this.datumZakazivanja).toISOString().split('T')[0];
  
      // Proveravamo da li je datum već zakazan
      if (this.usluga.datumiZakazivanja.includes(dateToBook)) {
        const alert = await this.alertCtrl.create({
          header: 'Greška',
          message: 'Ovaj datum je već zakazan.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
  
      // Ako datum nije zakazan, pozivamo metod za zakazivanje
      this.uslugeServis.zakaziUslugu(this.usluga, dateToBook).subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: 'Uspeh',
          message: 'Usluga je uspešno zakazana!',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/usluge/tabs/istrazi']);
            }
          }]
        });
  
        await alert.present();
      });
    }
  }

  getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onEdit() {
    this.editMode = !this.editMode;
  }

  onSave() {
    if (this.usluga) {
      this.uslugeServis.updateUsluga(this.usluga.id, this.usluga.nazivUsluge, this.usluga.kratakOpis).subscribe(() => {
        console.log('Usluga je uspešno ažurirana');
        this.editMode = false;
      });
    }
  }

  onDelete() {
    if (this.usluga) {
      this.alertCtrl.create({
        header: 'Potvrda',
        message: 'Da li ste sigurni da želite da obrišete ovu uslugu?',
        buttons: [
          {
            text: 'Otkaži',
            role: 'cancel'
          },
          {
            text: 'Obriši',
            handler: () => {
              this.uslugeServis.deleteUsluga(this.usluga!.id).subscribe(() => {
                console.log('Usluga je uspešno obrisana');
                this.router.navigate(['/usluge/tabs/istrazi']);
              });
            }
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }
  }
}
