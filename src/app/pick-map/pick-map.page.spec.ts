import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickMapPage } from './pick-map.page';

describe('PickMapPage', () => {
  let component: PickMapPage;
  let fixture: ComponentFixture<PickMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PickMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
