import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrijavaPage } from './prijava.page';

describe('PrijavaPage', () => {
  let component: PrijavaPage;
  let fixture: ComponentFixture<PrijavaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrijavaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
