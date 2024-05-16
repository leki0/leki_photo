import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistracijaPage } from './registracija.page';

describe('RegistracijaPage', () => {
  let component: RegistracijaPage;
  let fixture: ComponentFixture<RegistracijaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistracijaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
