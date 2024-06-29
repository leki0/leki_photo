import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../usluge.service';
import { UslugeModalComponent } from '../usluge-modal/usluge-modal.component';
import { OverlayEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-istrazi',
  templateUrl: './istrazi.page.html',
  styleUrls: ['./istrazi.page.scss'],
})
export class IstraziPage implements OnInit, OnDestroy {

  usluge: Usluga[] = [];
  private uslugaSub: Subscription | undefined;

  constructor(
    private menuCtrl: MenuController,
    private uslugaServis: UslugeService,
    private modalCtrl: ModalController
  ) {
    console.log('constructor');
  }

  openMenu() {
    this.menuCtrl.open();
  }

  ngOnInit() {
    this.uslugaSub = this.uslugaServis.usluge.subscribe((usluge) => {
      this.usluge = usluge;
    });
  }

  ionViewWillEnter() {
    this.uslugaServis.getUsluge().subscribe((usluge) => {
      console.log('Fetched usluge in ionViewWillEnter:', usluge);
    });
  }

  openModal() {
    this.modalCtrl.create({
      component: UslugeModalComponent,
      componentProps: { title: 'Dodaj uslugu' }
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData: OverlayEventDetail) => {
      if (resultData.role === 'confirm' && resultData.data && resultData.data.usluga) {
        console.log('Modal result data:', resultData);
        const uslugaData = resultData.data.usluga;
        this.uslugaServis.addUsluga(uslugaData.naziv, uslugaData.opis).subscribe((usluge) => {
          console.log('Added usluga:', usluge);
        });
      } else {
        console.error('Invalid resultData or missing usluga property:', resultData);
      }
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnDestroy() {
    if (this.uslugaSub) {
      this.uslugaSub.unsubscribe();
    }
  }
}
