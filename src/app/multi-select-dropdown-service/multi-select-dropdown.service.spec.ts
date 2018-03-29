import { TestBed, inject } from '@angular/core/testing';

import { MultiSelectDropdownService } from './multi-select-dropdown.service';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown.module';

describe('', () => {
  let service: MultiSelectDropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MultiSelectDropdownService]
    });

    service = TestBed.get(MultiSelectDropdownService);
  });

  describe('MultiSelectDropdownService should define a function named', () => {
    it('open', () => {
      // assert
      expect(service.open).toBeDefined();
    });

    it('register', () => {
      // assert
      expect(service.register).toBeDefined();
    });
  });

  describe('the open function on MultiSelectDropdownService', () => {
    it('should close all registered components except the selected component', () => {
      // arrange
      const first = new MultiSelectDropdownComponent(service);
      first.id = 1;
      service.components.push(first);
      const second = new MultiSelectDropdownComponent(service);
      second.id = 1;
      service.components.push(second);
      const component = new MultiSelectDropdownComponent(service);
      component.id = 2;
      component.isOpen = false;
      service.components.push(component);
      spyOn(first, 'close');
      spyOn(second, 'close');
      spyOn(component, 'close');

      // act
      service.open(component);

      // assert
      expect(first.close).toHaveBeenCalledTimes(1);
      expect(second.close).toHaveBeenCalledTimes(1);
      expect(component.close).not.toHaveBeenCalled();
    });
  });

  describe('the register function on MultiSelectDropdownService', () => {
    it('should add the passed component to the components list', () => {
      // arrange
      const component = new MultiSelectDropdownComponent(service);
      component.id = 99;
      service.components = [];

      // act
      service.register(component);

      // assert
      expect(service.components.length).toBe(1);
      expect(service.components[0].id).toBe(99);
    });

    it('should bind an event listener to the document body when an event listener has not been bound', () => {
      // arrange
      const component = new MultiSelectDropdownComponent(service);
      component.id = 99;
      service.isBodyListenerRegistered = false;
      const body = {
        addEventListener() {}
      };
      spyOn(document, 'querySelector').and.returnValue(body);
      const bodyEventListenerSpy = spyOn(body, 'addEventListener');

      // act
      service.register(component);

      // assert
      expect(document.querySelector).toHaveBeenCalledTimes(1);
      expect(document.querySelector).toHaveBeenCalledWith('body');
      expect(body.addEventListener).toHaveBeenCalledTimes(1);
      expect(bodyEventListenerSpy.calls.mostRecent().args[0]).toBe('click');
    });

    it('should not bind an event listener to the document body when an event listener has already been bound', () => {
      // arrange
      const component = new MultiSelectDropdownComponent(service);
      component.id = 99;
      service.isBodyListenerRegistered = true;
      const body = {
        addEventListener() {}
      };
      spyOn(document, 'querySelector').and.returnValue(body);
      const bodyEventListenerSpy = spyOn(body, 'addEventListener');

      // act
      service.register(component);

      // assert
      expect(document.querySelector).not.toHaveBeenCalled();
      expect(body.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe('the event listener bound to the body of the document', () => {
    it('should check whether the target of the click event has a MultiSelectDropdown as an ancestor', () => {
      // arrange
      const component = new MultiSelectDropdownComponent(service);
      component.id = 99;
      service.isBodyListenerRegistered = false;
      service.register(component);
      const button = document.createElement('button');
      const body = document.querySelector('body');
      body.appendChild(button);
      spyOn(service, 'findClosest');

      // act
      button.click();

      // assert
      expect(service.findClosest).toHaveBeenCalledTimes(1);
      expect(service.findClosest).toHaveBeenCalledWith(button);
    });

    it('should close all registered components when the target of the click event does not have a MultiSelectDropdown as an ancestor', () => {
      // arrange
      const first = new MultiSelectDropdownComponent(service);
      first.id = 99;
      const second = new MultiSelectDropdownComponent(service);
      second.id = 98;
      service.components.push(first);
      service.components.push(second);
      const component = new MultiSelectDropdownComponent(service);
      component.id = 96;
      service.isBodyListenerRegistered = false;
      service.register(component);
      const button = document.createElement('button');
      document.body.appendChild(button);
      spyOn(service, 'findClosest').and.returnValue(null);
      spyOn(first, 'close');
      spyOn(second, 'close');
      spyOn(component, 'close');

      // act
      button.click();

      // assert
      expect(first.close).toHaveBeenCalledTimes(1);
      expect(second.close).toHaveBeenCalledTimes(1);
      expect(component.close).toHaveBeenCalledTimes(1);
    });

    it('should not close all registered components when the target of the click event has a MultiSelectDropdown as an ancestor', () => {
      // arrange
      const first = new MultiSelectDropdownComponent(service);
      first.id = 99;
      const second = new MultiSelectDropdownComponent(service);
      second.id = 98;
      service.components.push(first);
      service.components.push(second);
      const component = new MultiSelectDropdownComponent(service);
      component.id = 96;
      service.isBodyListenerRegistered = false;
      service.register(component);
      const dropdown = document.createElement('app-multi-select-dropdown');
      document.body.appendChild(dropdown);
      spyOn(service, 'findClosest').and.returnValue(document.querySelector('body'));
      spyOn(first, 'close');
      spyOn(second, 'close');
      spyOn(component, 'close');

      // act
      dropdown.click();

      // assert
      expect(first.close).not.toHaveBeenCalled();
      expect(second.close).not.toHaveBeenCalled();
      expect(component.close).not.toHaveBeenCalled();
    });
  });
});
