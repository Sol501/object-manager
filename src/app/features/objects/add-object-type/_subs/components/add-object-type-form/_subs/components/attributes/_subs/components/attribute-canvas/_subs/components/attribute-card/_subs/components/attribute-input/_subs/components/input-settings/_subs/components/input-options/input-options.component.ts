import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import {
  AttributeInputForm,
  createInputOption,
} from '../../../../../../../../../../../../../../../attribute-input-form.model';

@Component({
  selector: 'app-input-options',
  standalone: true,
  imports: [ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './input-options.component.html',
  styleUrl: './input-options.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOptionsComponent {
  private readonly _container = inject(ControlContainer);
  get group(): AttributeInputForm {
    return this._container.control as AttributeInputForm;
  }
  addOption(): void {
    this.group.controls.options.push(createInputOption());
  }
  removeOption(index: number): void {
    this.group.controls.options.removeAt(index);
  }
}
