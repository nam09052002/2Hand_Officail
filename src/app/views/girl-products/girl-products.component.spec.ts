import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GirlProductsComponent } from './girl-products.component';

describe('GirlProductsComponent', () => {
  let component: GirlProductsComponent;
  let fixture: ComponentFixture<GirlProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GirlProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GirlProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
