import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementProductsComponent } from './management-products.component';

describe('ManagementProductsComponent', () => {
  let component: ManagementProductsComponent;
  let fixture: ComponentFixture<ManagementProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagementProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
