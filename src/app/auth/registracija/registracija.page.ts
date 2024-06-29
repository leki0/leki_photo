import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.page.html',
  styleUrls: ['./registracija.page.scss'],
})
export class RegistracijaPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      ime: new FormControl('Aleksa', Validators.required),
      prezime: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)]),
    });
  }

  onRegister() {
    this.loadingCtrl.create({ message: 'Registering...' }).then((loadingEl) => {
      loadingEl.present();
      this.authService.registracija(this.registerForm.value).subscribe(
        (resData) => {
          console.log('Registracija uspjesna!');
          console.log(resData);
          loadingEl.dismiss();
          this.router.navigateByUrl('/usluge');
        },
        (errRes) => {
          loadingEl.dismiss();
          const code = errRes.error.error.message;
          let message = 'Došlo je do greške prilikom registracije.';
          if (code === 'EMAIL_EXISTS') {
            message = 'Korisnik sa ovom email adresom već postoji!';
          }
          this.alertCtrl
            .create({
              header: 'Registracija nije uspjela',
              message: message,
              buttons: [
                {
                  text: 'U redu',
                  handler: () => {
                    if (code === 'EMAIL_EXISTS') {
                      this.router.navigateByUrl('/prijava');
                    }
                  },
                },
              ],
            })
            .then((alertEl) => {
              alertEl.present();
            });
        }
      );
    });
  }
}
