import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ControlContainer,ReactiveFormsModule } from '@angular/forms';
import { ObjectInfoForm } from '../../../../../../add-object-form.model';

@Component({
  selector: 'app-object-name-fields',
	standalone: true,
  imports:  [ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './object-name-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectNameFieldsComponent {
  private readonly _container = inject(ControlContainer);
  readonly arabicVisible = signal(false);
  readonly chineseVisible = signal(false);

  get group(): ObjectInfoForm {
    return this._container.control as ObjectInfoForm;
 }

  toggleArabic(): void {
    this.arabicVisible.update((visible) => !visible);
  }

  toggleChinese(): void {
    this.chineseVisible.update((visible) => !visible);
  }
}
