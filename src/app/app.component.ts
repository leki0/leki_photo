import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from './auth/auth.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser$: Observable<UserData | null> | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser;
    this.currentUser$.subscribe(user => {
      console.log('Current user:', user); // Log current user
    });
  }
}
