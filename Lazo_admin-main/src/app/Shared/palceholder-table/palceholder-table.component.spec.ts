import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalceholderTableComponent } from './palceholder-table.component';

describe('PalceholderTableComponent', () => {
  let component: PalceholderTableComponent;
  let fixture: ComponentFixture<PalceholderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalceholderTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PalceholderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
