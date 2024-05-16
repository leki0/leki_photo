import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UslugePage } from './usluge.page';

describe('UslugePage', () => {
  let component: UslugePage;
  let fixture: ComponentFixture<UslugePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UslugePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
