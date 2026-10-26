import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { AttributeInputForm } from '../../../../../../../../../../../../../../../attribute-input-form.model';
import { MultiSelectComponent } from '../../../../../../../../../../../../../../../../../../../../../../../../shared/ui/multi-select/multi-select.component';
@Component({
  selector: 'app-input-security-settings',
  standalone: true,
  imports: [ReactiveFormsModule, MultiSelectComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './input-security-settings.component.html',
  styleUrl: './input-security-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSecuritySettingsComponent {
  private readonly _container = inject(ControlContainer);
  get group(): AttributeInputForm {
    return this._container.control as AttributeInputForm;
  }
  readonly personas = [1, 2, 3, 4].map((id) => ({ id: `${id}`, label: `Persona ${id}` }));
  readonly roles = [1, 2, 3, 4].map((id) => ({ id: `${id}`, label: `Role ${id}` }));
}
