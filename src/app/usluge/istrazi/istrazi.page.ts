import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from '../usluge.service';

@Component({
  selector: 'app-istrazi',
  templateUrl: './istrazi.page.html',
  styleUrls: ['./istrazi.page.scss'],
})
export class IstraziPage implements OnInit {

  usluge: Usluga[];
  constructor(private menuCtrl: MenuController, private uslugaServis: UslugeService) {
    console.log('constructor');
    this.usluge = this.uslugaServis.usluge;
  }

  openMenu() {
    this.menuCtrl.open();
  }
  ngOnInit() {
    console.log('ngOnInit');
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
