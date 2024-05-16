import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UslugaDetaljiPage } from './usluga-detalji.page';

describe('UslugaDetaljiPage', () => {
  let component: UslugaDetaljiPage;
  let fixture: ComponentFixture<UslugaDetaljiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UslugaDetaljiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
