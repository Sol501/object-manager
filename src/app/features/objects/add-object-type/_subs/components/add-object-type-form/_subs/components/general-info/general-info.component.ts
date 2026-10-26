import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from '../../../../../../../../../shared/ui/toggle-switch/toggle-switch.component';
import { GeneralInfoForm } from '../../../add-object-type-form.model';
import { IconUploadComponent } from './_subs/components/icon-upload/icon-upload.component';

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [ReactiveFormsModule, ToggleSwitchComponent, IconUploadComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  private readonly _container = inject(ControlContainer);

  get group(): GeneralInfoForm {
    return this._container.control as GeneralInfoForm;
  }

  setToggle(field: 'protected' | 'measurable' | 'auditTrail', value: boolean): void {
    const control = this.group.controls[field];
    control.setValue(value);
    control.markAsDirty();
  }
}
