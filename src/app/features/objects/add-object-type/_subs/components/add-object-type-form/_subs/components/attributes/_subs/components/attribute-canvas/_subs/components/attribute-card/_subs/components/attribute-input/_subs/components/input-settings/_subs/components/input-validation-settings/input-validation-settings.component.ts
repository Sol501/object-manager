import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-validation-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './input-validation-settings.component.html',
  styleUrl: './input-validation-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputValidationSettingsComponent {
  readonly limits = [
    { name: 'minLength', label: 'Minimum Length' },
    { name: 'maxLength', label: 'Maximum Length' },
    { name: 'minWords', label: 'Minimum Word Length' },
    { name: 'maxWords', label: 'Maximum Word Length' },
  ] as const;
}
