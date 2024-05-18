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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

  }
  prijava(form: NgForm) {
    console.log(form);
    this.authService.prijava();
    this.router.navigateByUrl('usluge/tabs/istrazi');
  }


}
