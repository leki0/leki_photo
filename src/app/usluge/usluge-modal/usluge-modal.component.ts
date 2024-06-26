import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-usluge-modal',
  templateUrl: './usluge-modal.component.html',
  styleUrls: ['./usluge-modal.component.scss'],
})
export class UslugeModalComponent implements OnInit {
  @Input()
  title!: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onAddUsluga(forma: NgForm) {
    if (!forma.valid) {
      return;
    }
    this.modalCtrl.dismiss({ usluga: { naziv: forma.value['naziv'], opis: forma.value['opis'] } }, 'confirm');
  }
}
