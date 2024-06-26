import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.page.html',
  styleUrls: ['./prijava.page.scss'],
})
export class PrijavaPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  OnPrijava(form: NgForm) {
    this.isLoading = true;
    console.log(form);
    if (form.valid) {
      this.authService.prijava(form.value).subscribe(
        (resData) => {
          console.log("Prijava uspješna!");
          console.log(resData);
          this.isLoading = false;
          this.router.navigateByUrl('usluge/tabs/istrazi');
        },
        (errRes) => {
          console.log(errRes);
          this.isLoading = false;
          let message = "Nisu dobro unijeti email ili lozinka";
          const code = errRes.error.error.message;
          if (code === "EMAIL_NOT_FOUND") {
            message = "Korisnik nije registrovan, morate prvo da se registrujete!";
          } else if (code === "INVALID_PASSWORD") {
            message = "Lozinka nije ispravno unijeta!";
          }

          this.alertCtrl.create({
            header: "Greška prilikom prijave",
            message,
            buttons: ["Okay"]
          }).then((alert) => {
            alert.present();
          });
          form.reset();
        }
      );
    } else {
      this.isLoading = false;
    }
  }
}
