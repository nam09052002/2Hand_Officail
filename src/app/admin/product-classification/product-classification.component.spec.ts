import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductClassificationComponent } from './product-classification.component';

describe('ProductClassificationComponent', () => {
  let component: ProductClassificationComponent;
  let fixture: ComponentFixture<ProductClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductClassificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
