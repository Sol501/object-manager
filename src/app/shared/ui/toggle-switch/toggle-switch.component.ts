import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  styleUrl: './toggle-switch.component.scss',
  templateUrl: './toggle-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleSwitchComponent {
  readonly label = input.required<string>();
  readonly showLabel = input(false);
  readonly checked = input(false);
  readonly disabled = input(false);
  readonly changed = output<boolean>();
  readonly blurred = output<void>();
}
