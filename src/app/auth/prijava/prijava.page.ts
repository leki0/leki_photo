import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.page.html',
  styleUrls: ['./prijava.page.scss'],
})
export class PrijavaPage implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

  }
  OnPrijava(form: NgForm) {
    this.isLoading = true;
    console.log(form);
    if (form.valid) {
      this.authService.prijava(form.value).subscribe(resData => {
        console.log("Prijava uspjesna!");
        console.log(resData);
        this.isLoading = false;
        this.router.navigateByUrl('usluge/tabs/istrazi');
      });
    }


  }


}
