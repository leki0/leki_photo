import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Usluga } from 'src/app/usluga.model';

@Component({
  selector: 'app-usluga-element',
  templateUrl: './usluga-element.component.html',
  styleUrls: ['./usluga-element.component.scss'],
})
export class UslugaElementComponent implements OnInit {

  @Input() usluga: Usluga = { id: "u1", nazivUsluge: "Fotografisanje slavlja", kratakOpis: "blabla", imgUrl: '',userId:"xx" };
  constructor(private alertCtrl: AlertController) { }

  ngOnInit() { }


  openAlert(event: any) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Otvoren alert prozor!");
    this.alertCtrl.create({
      header: "Sačuvaj uslugu",
      message: "Da li ste sigurni da želite da sačuvate uslugu?",
      buttons: [
        {
          text: "Save",
          handler: () => {
            console.log("Sačuvano!");
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Canceled!");
          }
        }
      ]
    }).then((alert:HTMLIonAlertElement)=>{
      alert.present();
    });
  }

}
