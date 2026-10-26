import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ToggleSwitchComponent } from '../../../../../../../../../../../../shared/ui/toggle-switch/toggle-switch.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component( {
  selector: 'app-bypass-toggle',
  standalone: true,
  imports: [ToggleSwitchComponent],
  templateUrl: './bypass-toggle.component.html',
  providers: [
    {
       provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BypassToggleComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BypassToggleComponent implements ControlValueAccessor {
  readonly checked = signal(false);
  readonly disabled = signal(false);
  private _onChange: (value: boolean) => void = () => undefined;
  private _onTouched: () => void = () => undefined;

  writeValue(value: boolean | null): void {
    this.checked.set(value === true);
  }

  registerOnChange(fn: (value: boolean) => void): void {
   this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState( disabled: boolean): void {
    this.disabled.set(disabled);
  }

  change(checked: boolean): void {
    if (this.disabled()) {
      return;
    }

   this.checked.set(checked);
    this._onChange(checked);
  }

  blur():  void {
    this._onTouched();
  }
}
