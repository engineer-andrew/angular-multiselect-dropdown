import { Injectable } from '@angular/core';
import { MultiSelectDropdownServiceInterface } from './multi-select-dropdown-service.interface';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown.module';

@Injectable()
export class MultiSelectDropdownService implements MultiSelectDropdownServiceInterface {
  public isBodyListenerRegistered = false;
  public components: MultiSelectDropdownComponent[] = [];

  constructor() { }

  findClosest(element: HTMLElement): HTMLElement {
    return element && (element.className === 'multi-select-dropdown-container' ? element : this.findClosest(<HTMLElement>element.parentNode));
  }

  open(component: MultiSelectDropdownComponent): void {
    this.components.forEach(c => {
      if (component.id !== c.id) {
        c.close();
      }
    });
  }

  register(component: MultiSelectDropdownComponent): void {
    this.components.push(component);
    if (!this.isBodyListenerRegistered) {
      document.querySelector('body').addEventListener('click', (event) => {
        const match = this.findClosest(<HTMLElement>event.target);
        if (match === null) {
          this.components.forEach(c => c.close());
        }
      });
    }
  }
}
