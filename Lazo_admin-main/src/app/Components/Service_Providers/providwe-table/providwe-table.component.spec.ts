import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidweTableComponent } from './providwe-table.component';

describe('ProvidweTableComponent', () => {
  let component: ProvidweTableComponent;
  let fixture: ComponentFixture<ProvidweTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvidweTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProvidweTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
