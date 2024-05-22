import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../usluge.service';
import { UslugeModalComponent } from '../usluge-modal/usluge-modal.component';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-istrazi',
  templateUrl: './istrazi.page.html',
  styleUrls: ['./istrazi.page.scss'],
})
export class IstraziPage implements OnInit {

  usluge: Usluga[];
  constructor(private menuCtrl: MenuController, private uslugaServis: UslugeService, private modalCtrl: ModalController) {
    console.log('constructor');
    this.usluge = this.uslugaServis.usluge;
  }

  openMenu() {
    this.menuCtrl.open();
  }

  ngOnInit() {
    console.log('ngOnInit');
  }
  openModal() {
    this.modalCtrl.create({
      component: UslugeModalComponent
    }).then((modal: HTMLIonModalElement) => { modal.present(); 
      return modal.onDidDismiss();
    }).then((resultData:OverlayEventDetail<any>)=>{
      if(resultData.role==='confirm'){
        console.log(resultData);
      }
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
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
    console.log('ngOnDestroy');
  }


}
