import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { ObjectInfoOptions } from '../../../../../../../../../core/objects/object.models';
import { SearchableSelectComponent } from '../../../../../../../../../shared/ui/searchable-select/searchable-select.component';
import { ObjectInfoForm } from '../../../add-object-form.model';
import { BypassToggleComponent } from './_subs/components/bypass-toggle/bypass-toggle.component';
import { ObjectNameFieldsComponent } from './_subs/components/object-name-fields/object-name-fields.component';

@Component({
 selector: 'app-object-info',
  standalone: true,
  imports:[
    ReactiveFormsModule,
    ObjectNameFieldsComponent,
    BypassToggleComponent,
    SearchableSelectComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './object-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectInfoComponent {
  private readonly _container = inject(ControlContainer);
  readonly options =  input.required<ObjectInfoOptions>();

  get group(): ObjectInfoForm {
   return this._container.control as ObjectInfoForm;
  }
}
