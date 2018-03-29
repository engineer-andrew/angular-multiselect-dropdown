import { Component, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { MultiSelectDropdownOption } from './models/multi-select-dropdown-option.model';
import { MultiSelectDropdownComponent, MultiSelectDropdownService } from './multi-select-dropdown.module';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChildren(MultiSelectDropdownComponent) dropdowns: QueryList<MultiSelectDropdownComponent>;

  constructor(private multiSelectDropdownService: MultiSelectDropdownService) {}

  public creatures = '';
  public kingdom = '';
  public princess = '';

  private princesses: MultiSelectDropdownOption[] = [
    {id: 'cinderella', value: 'Princess.Cinderella', display: 'Cinderella', isSelected: false},
    {id: 'snow-white', value: 'Princess.Snow-White', display: 'Snow White', isSelected: false},
    {id: 'briar-rose', value: 'Princess.Briar-Rose', display: 'Sleeping Beauty', isSelected: false}
  ];

  private fantasyCreatures: MultiSelectDropdownOption[] = [
    {id: 'fairies', value: 'Creatures.Fairies', display: 'Fairies', isSelected: false},
    {id: 'trolls', value: 'Creatures.Trolls', display: 'Trolls', isSelected: false},
    {id: 'ogres', value: 'Creatures.Ogres', display: 'Ogres', isSelected: false}
  ];

  private kingdoms: MultiSelectDropdownOption[] = [
    {id: 'westeros', value: 'Kingdom.Westeros', display: 'Westeros', isSelected: false},
    {id: 'agartha', value: 'Kingdom.Agartha', display: 'Agartha', isSelected: false},
    {id: 'Shambhala', value: 'Kingdom.Shambhala', display: 'Shambhala', isSelected: false}
  ];

  select($event) {
    if (!!this.fantasyCreatures.find(c => c.isSelected)) {

      this.creatures = this.fantasyCreatures.map(c => {
        if (c.isSelected) {
          return c.display;
        }
      }).join(', ');
    }

    if (!!this.kingdoms.find(k => k.isSelected)) {
      this.kingdom = this.kingdoms.find(k => k.isSelected).display;
    }

    if (!!this.princesses.find(p => p.isSelected)) {
      this.princess = this.princesses.find(p => p.isSelected).display;
    }
  }
}
