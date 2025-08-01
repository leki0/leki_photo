import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../../usluge.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-usluga-detalji',
  templateUrl: './usluga-detalji.page.html',
  styleUrls: ['./usluga-detalji.page.scss'],
  providers: [DatePipe]
})
export class UslugaDetaljiPage implements OnInit {
  usluga: Usluga | undefined;
  datumZakazivanja: string | undefined;
  formattedDatumZakazivanja: string | undefined;
  userRole: string | null = null;
  editMode = false;
  selectedImage: File | null = null;
  isPopoverOpen = false;
  sviDatumiZakazivanja: string[] = [];
  lokacija: string = ''; 
  dodatniKomentar: string = '';
  isModalOpen = false; 
  selectedTermin: Usluga | null = null; 

  constructor(
    private route: ActivatedRoute,
    private uslugeServis: UslugeService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController,
    private datePipe: DatePipe 
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

    this.uslugeServis.getAllDatumiZakazivanja().subscribe(datumi => {
      this.sviDatumiZakazivanja = datumi;
      console.log('Svi datumi zakazivanja:', this.sviDatumiZakazivanja);
    });
  }

  openModal(termin: Usluga) {
    this.selectedTermin = termin;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openDatePicker() {
    this.isPopoverOpen = true;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }
  confirmDate() {
    if (this.datumZakazivanja) {
      const selectedDate = new Date(this.datumZakazivanja);
      const today = new Date();
  
      if (selectedDate < today) {
        this.alertCtrl.create({
          header: 'Greška',
          message: 'Ne možete zakazati datum u prošlosti!',
          buttons: ['OK']
        }).then(alert => alert.present());
        return;
      }
  
      this.formattedDatumZakazivanja = this.datePipe.transform(this.datumZakazivanja, 'dd/MM/yyyy HH:mm') || 'N/A';
    }
    this.closePopover();
  }
  

  async onZakazi() {
    if (!this.datumZakazivanja || !this.lokacija) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: !this.datumZakazivanja ? 'Datum zakazivanja nije odabran!' : 'Lokacija nije uneta!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    const selectedDate = new Date(this.datumZakazivanja);
    const today = new Date();
  
    if (selectedDate < today) {
      const alert = await this.alertCtrl.create({
        header: 'Greška',
        message: 'Ne možete zakazati datum u prošlosti!',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
  
    function formatDateForComparison(date:string) {
      const d = new Date(date);
      let day = '' + d.getDate();
      let month = '' + (d.getMonth() + 1);
      const year = d.getFullYear();
    
      if (day.length < 2) day = '0' + day;
      if (month.length < 2) month = '0' + month;
    
      return [day, month, year].join('/');
    }
  
    if (this.usluga && this.datumZakazivanja) {

      const originalDateToBook = new Date(this.datumZakazivanja).toISOString();
      
      const dateToBook = formatDateForComparison(this.datumZakazivanja);
      console.log("Zakazani datum:" + originalDateToBook);
      console.log("Vec postojeci zakazani datumi: " + this.sviDatumiZakazivanja);
  
      const existingDates = this.sviDatumiZakazivanja.map(date => formatDateForComparison(date));
  
      if (existingDates.includes(dateToBook)) {
        const alert = await this.alertCtrl.create({
          header: 'Greška',
          message: 'Ovaj datum je već zakazan.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
  
      this.usluga.datumiZakazivanja.push(originalDateToBook);
  
      this.uslugeServis.zakaziUslugu(this.usluga, originalDateToBook, this.lokacija, this.dodatniKomentar).subscribe(async () => {
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
      }, async error => {
        console.error('Greška pri zakazivanju usluge:', error);
        const alert = await this.alertCtrl.create({
          header: 'Greška',
          message: 'Došlo je do greške pri zakazivanju usluge. Pokušajte ponovo kasnije.',
          buttons: ['OK']
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

async onSave() {
  if (!this.usluga) return;

  let newImageUrl = this.usluga.slikaUrl;

  if (this.selectedImage) {
  try {
    newImageUrl = await this.uslugeServis.uploadUpdatedImage(this.selectedImage, this.usluga.slikaUrl);
    this.usluga.slikaUrl = newImageUrl;
  } catch (err) {
    console.error('Greška pri uploadu slike:', err);
    return;
  }
}

  this.uslugeServis.updateUsluga(
    this.usluga.id,
    this.usluga.nazivUsluge,
    this.usluga.kratakOpis,
    newImageUrl
  ).subscribe(() => {
    console.log('Usluga uspešno ažurirana');
    this.editMode = false;
    this.selectedImage = null;
  });
}



  onImageSelected(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput?.files && fileInput.files.length > 0) {
    this.selectedImage = fileInput.files[0];
    console.log('Odabrana nova slika:', this.selectedImage.name);
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
