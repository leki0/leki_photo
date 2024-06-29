import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Usluga } from 'src/app/usluga.model';
import { UslugeService } from 'src/app/usluge/usluge.service';

@Component({
  selector: 'app-usluga-element',
  templateUrl: './usluga-element.component.html',
  styleUrls: ['./usluga-element.component.scss'],
})
export class UslugaElementComponent implements OnInit {

  @Input()
  usluga!: Usluga;

  constructor(private alertCtrl: AlertController, private uslugeService: UslugeService) { }

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
            this.saveUsluga();
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
    }).then((alert) => {
      alert.present();
    });
  }

  saveUsluga() {
    this.uslugeService.saveUsluga(this.usluga).subscribe(() => {
      console.log("Sačuvano!");
    });
  }
}
