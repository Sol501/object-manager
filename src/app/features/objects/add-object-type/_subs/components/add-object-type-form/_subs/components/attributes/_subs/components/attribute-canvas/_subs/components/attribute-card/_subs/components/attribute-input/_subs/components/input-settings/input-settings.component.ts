import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AttributeInput } from '../../../../../../../../../../../../../../../../../../../../../core/object-types/object-type.models';
import {
  AttributeInputForm,
  createAttributeInput,
  hasInputOptions,
} from '../../../../../../../../../../../../attribute-input-form.model';
import { ButtonDirective } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/button/button.directive';
import { DialogComponent } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { InputGeneralSettingsComponent } from './_subs/components/input-general-settings/input-general-settings.component';
import { InputOptionsComponent } from './_subs/components/input-options/input-options.component';
import { InputValidationSettingsComponent } from './_subs/components/input-validation-settings/input-validation-settings.component';
import { InputSourceSettingsComponent } from './_subs/components/input-source-settings/input-source-settings.component';
import { InputSecuritySettingsComponent } from './_subs/components/input-security-settings/input-security-settings.component';
import { InputConditionalSettingsComponent } from './_subs/components/input-conditional-settings/input-conditional-settings.component';

@Component({
  selector: 'app-input-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonDirective,
    DialogComponent,
    InputGeneralSettingsComponent,
    InputOptionsComponent,
    InputValidationSettingsComponent,
    InputSourceSettingsComponent,
    InputSecuritySettingsComponent,
    InputConditionalSettingsComponent,
  ],
  templateUrl: './input-settings.component.html',
  styleUrl: './input-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSettingsComponent implements OnInit {
  readonly value = input.required<AttributeInput>();
  readonly fields = input.required<readonly { id: string; label: string }[]>();
  readonly saved = output<AttributeInput>();
  readonly dismissed = output<void>();
  readonly section = signal('general');
  readonly hasOptions = hasInputOptions;
  form!: AttributeInputForm;
  ngOnInit(): void {
    this.form = createAttributeInput(this.value().kind, this.value());
  }
  save(): void {
    this.saved.emit(this.form.getRawValue());
  }
}
