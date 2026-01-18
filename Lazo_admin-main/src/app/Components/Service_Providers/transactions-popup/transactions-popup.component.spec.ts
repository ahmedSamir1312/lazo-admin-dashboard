import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsPopupComponent } from './transactions-popup.component';

describe('TransactionsPopupComponent', () => {
  let component: TransactionsPopupComponent;
  let fixture: ComponentFixture<TransactionsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
