import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IstraziPage } from './istrazi.page';

describe('IstraziPage', () => {
  let component: IstraziPage;
  let fixture: ComponentFixture<IstraziPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IstraziPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
