import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiSelectDropdownComponent } from './multi-select-dropdown-component/multi-select-dropdown.component';
import { MultiSelectDropdownService } from './multi-select-dropdown-service/multi-select-dropdown.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MultiSelectDropdownComponent],
  exports: [MultiSelectDropdownComponent],
  providers: [MultiSelectDropdownService]
})
export class MultiSelectDropdownModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: MultiSelectDropdownModule
    };
  }
}
export { MultiSelectDropdownComponent } from './multi-select-dropdown-component/multi-select-dropdown.component';
export { MultiSelectDropdownService } from './multi-select-dropdown-service/multi-select-dropdown.service';