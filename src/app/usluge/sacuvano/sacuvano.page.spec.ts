import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SacuvanoPage } from './sacuvano.page';

describe('SacuvanoPage', () => {
  let component: SacuvanoPage;
  let fixture: ComponentFixture<SacuvanoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SacuvanoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
