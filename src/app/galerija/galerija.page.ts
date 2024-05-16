import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-galerija',
  templateUrl: './galerija.page.html',
  styleUrls: ['./galerija.page.scss'],
})
export class GalerijaPage implements OnInit {

  constructor(private menuCtrl: MenuController) {
    console.log('constructor');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  openMenu() {
    this.menuCtrl.open();
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
