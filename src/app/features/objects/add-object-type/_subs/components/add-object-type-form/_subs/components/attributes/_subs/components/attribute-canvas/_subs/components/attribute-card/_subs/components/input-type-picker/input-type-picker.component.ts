import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { AttributeInputKind } from '../../../../../../../../../../../../../../../../../../core/object-types/object-type.models';
import {
  ADVANCED_INPUT_TYPES,
  BASIC_INPUT_TYPES,
} from '../../../../../../../../../attribute-input-form.model';
import { ButtonDirective } from '../../../../../../../../../../../../../../../../../../shared/ui/button/button.directive';
import { DialogComponent } from '../../../../../../../../../../../../../../../../../../shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-input-type-picker',
  standalone: true,
  imports: [ButtonDirective, DialogComponent],
  templateUrl: './input-type-picker.component.html',
  styleUrl: './input-type-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTypePickerComponent {
  readonly types = [...BASIC_INPUT_TYPES, ...ADVANCED_INPUT_TYPES];
  readonly selected = signal<AttributeInputKind | null>(null);
  readonly added = output<AttributeInputKind>();
  readonly dismissed = output<void>();

  add(): void {
    const kind = this.selected();
    if (kind) this.added.emit(kind);
  }
}
