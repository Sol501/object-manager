import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AttributeInput } from '../../../../../../../../../../../../../../../../../../../../../core/object-types/object-type.models';
import {
  AttributeInputForm,
  createAttributeInput,
} from '../../../../../../../../../../../../attribute-input-form.model';
import { DialogComponent } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { ButtonDirective } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/button/button.directive';
import { InputGeneralSettingsComponent } from '../input-settings/_subs/components/input-general-settings/input-general-settings.component';
import { InputValidationSettingsComponent } from '../input-settings/_subs/components/input-validation-settings/input-validation-settings.component';
import { InputConditionalSettingsComponent } from '../input-settings/_subs/components/input-conditional-settings/input-conditional-settings.component';
import { InputSecuritySettingsComponent } from '../input-settings/_subs/components/input-security-settings/input-security-settings.component';
import { InputSourceSettingsComponent } from '../input-settings/_subs/components/input-source-settings/input-source-settings.component';
@Component({
  selector: 'app-advanced-input-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogComponent,
    ButtonDirective,
    InputGeneralSettingsComponent,
    InputValidationSettingsComponent,
    InputConditionalSettingsComponent,
    InputSecuritySettingsComponent,
    InputSourceSettingsComponent,
  ],
  templateUrl: './advanced-input-settings.component.html',
  styleUrl: './advanced-input-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedInputSettingsComponent implements OnInit {
  readonly value = input.required<AttributeInput>();
  readonly saved = output<string[] | null>();
  readonly dismissed = output<void>();
  readonly section = signal('general');
  readonly columns = new FormArray<FormControl<string>>([]);
  readonly fields = [{ id: 'Submit', label: 'Submit' }];
  form!: AttributeInputForm;
  get sourceOnly(): boolean {
    return ['gantt', 'tasks-board'].includes(this.value().kind);
  }
  get dynamic(): boolean {
    return this.value().kind === 'dynamic-grid';
  }
  ngOnInit(): void {
    this.form = createAttributeInput(this.value().kind);
    this.form.controls.conditional.controls.fieldId.setValue('Submit');
    if (this.sourceOnly) this.section.set('source');
    for (const column of this.value().columns.length ? this.value().columns : [''])
      this.columns.push(new FormControl(column, { nonNullable: true }));
  }
  addColumn(): void {
    this.columns.push(new FormControl('', { nonNullable: true }));
  }
  save(): void {
    this.saved.emit(this.dynamic ? this.columns.getRawValue() : null);
  }
}
