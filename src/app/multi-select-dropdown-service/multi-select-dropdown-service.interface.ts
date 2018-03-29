import { MultiSelectDropdownComponent } from '../multi-select-dropdown-component/multi-select-dropdown.component';

export interface MultiSelectDropdownServiceInterface {
    open(component: MultiSelectDropdownComponent);
    register(component: MultiSelectDropdownComponent);
}
