import { MultiSelectDropdownServiceInterface  } from './multi-select-dropdown-service.interface';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown.module';

export class MockMultiSelectDropdownService implements MultiSelectDropdownServiceInterface {
    open(component: MultiSelectDropdownComponent) {
    }

    register(component: MultiSelectDropdownComponent) {
    }
}
