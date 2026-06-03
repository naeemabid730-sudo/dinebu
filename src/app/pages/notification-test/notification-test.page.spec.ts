import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationTestPage } from './notification-test.page';

describe('NotificationTestPage', () => {
  let component: NotificationTestPage;
  let fixture: ComponentFixture<NotificationTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
