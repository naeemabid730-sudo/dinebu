import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAddrassPage } from './my-addrass.page';

describe('MyAddrassPage', () => {
  let component: MyAddrassPage;
  let fixture: ComponentFixture<MyAddrassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAddrassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
