import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { AttributeInputForm } from '../../../../../../../../../../../../../../../attribute-input-form.model';
import { ATTRIBUTE_INPUT_SOURCES } from '../../../../../../../../../../../../../../../attribute-input-sources';
@Component({
  selector: 'app-input-source-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './input-source-settings.component.html',
  styleUrl: './input-source-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSourceSettingsComponent {
  private readonly _container = inject(ControlContainer);
  get group(): AttributeInputForm['controls']['dataSource'] {
    return this._container.control as AttributeInputForm['controls']['dataSource'];
  }
  readonly sources = ATTRIBUTE_INPUT_SOURCES;
  choose(type: string): void {
    const selected = this.group.controls.type.value === type;
    this.group.setValue({ type: selected ? '' : type, source: selected ? '' : 'Data Sorce 1' });
  }
}
