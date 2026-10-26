import { Directive } from '@angular/core';

@Directive({
  selector: 'table[appTable]',
  standalone: true,
  host: {
    class: 'table table-striped table-hover object-table mb-0',
  },
})
export class TableDirective {}
