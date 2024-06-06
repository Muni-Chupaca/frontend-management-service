import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandButtonComponent } from './expand-button.component';

describe('ExpandButtonComponent', () => {
  let component: ExpandButtonComponent;
  let fixture: ComponentFixture<ExpandButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpandButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
