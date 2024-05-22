import { Component, OnInit, viewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-usluge-modal',
  templateUrl: './usluge-modal.component.html',
  styleUrls: ['./usluge-modal.component.scss'],
})
export class UslugeModalComponent implements OnInit {
  forma: any;

  constructor(private modalCtrl: ModalController) {

  }

  ngOnInit() { }

  onCancel() {
    this.modalCtrl.dismiss();
  }
  onAddUsluga(forma: NgForm) {
    if (!this.forma.valid) {
      return;
    }
    this.modalCtrl.dismiss({ usluga: { naziv: this.forma.value['naziv'], opis: this.forma.value['opis'] } }, 'confirm');
  }

}
