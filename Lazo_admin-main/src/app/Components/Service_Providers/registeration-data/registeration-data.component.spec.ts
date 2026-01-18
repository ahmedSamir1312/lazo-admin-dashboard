import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterationDataComponent } from './registeration-data.component';

describe('RegisterationDataComponent', () => {
  let component: RegisterationDataComponent;
  let fixture: ComponentFixture<RegisterationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterationDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
