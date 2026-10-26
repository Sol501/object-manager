import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { AttributeInputForm } from '../../../../../../../../../../../../../../../attribute-input-form.model';

@Component({
  selector: 'app-input-conditional-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './input-conditional-settings.component.html',
  styleUrl: './input-conditional-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputConditionalSettingsComponent {
  private readonly _container = inject(ControlContainer);
  get group(): AttributeInputForm['controls']['conditional'] {
    return this._container.control as AttributeInputForm['controls']['conditional'];
  }
  readonly fields = input.required<readonly { id: string; label: string }[]>();
}
