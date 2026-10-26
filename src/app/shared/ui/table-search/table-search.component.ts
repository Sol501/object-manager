import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-table-search',
  standalone: true,
  styleUrl: './table-search.component.scss',
  templateUrl: './table-search.component.html',
  host: { class: 'd-block table-search' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSearchComponent {
  readonly label = input.required<string>();
  readonly value = input('');
  readonly autofocus = input(false);
  readonly changed = output<string>();
}
