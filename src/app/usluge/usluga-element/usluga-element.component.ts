import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
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
  isAdmin = false;

  constructor(private alertCtrl: AlertController, private uslugeService: UslugeService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.userRole.subscribe(role => {
      this.isAdmin = (role === 'admin');
    });
  }

  openAlert(event: any) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Otvoren alert prozor!");
    this.alertCtrl.create({
      header: "Zakaži uslugu",
      message: "Da li ste sigurni da želite da zakažete uslugu_?",
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
      console.log("Zakazano!");
    });
  }
}
