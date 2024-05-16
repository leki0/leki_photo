import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalerijaPage } from './galerija.page';

describe('GalerijaPage', () => {
  let component: GalerijaPage;
  let fixture: ComponentFixture<GalerijaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GalerijaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
