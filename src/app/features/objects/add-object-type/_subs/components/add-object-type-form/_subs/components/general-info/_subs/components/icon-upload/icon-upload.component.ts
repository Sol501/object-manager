import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-icon-upload',
  standalone: true,
  host: { class: 'd-block' },
  templateUrl: './icon-upload.component.html',
  styleUrl: './icon-upload.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IconUploadComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconUploadComponent implements ControlValueAccessor {
  private readonly _input = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private _onChange: (file: File | null) => void = () => undefined;
  private _onTouched: () => void = () => undefined;

  readonly fileName = signal('');
  readonly disabled = signal(false);

  writeValue(value: File | null): void {
    this.fileName.set(value?.name ?? '');
    const input = this._input()?.nativeElement;
    if (!value && input) {
      input.value = '';
    }
  }

  registerOnChange(fn: (file: File | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  selectFile(input: HTMLInputElement): void {
    if (this.disabled()) {
      return;
    }

    const file = input.files?.[0] ?? null;
    this.fileName.set(file?.name ?? '');
    this._onChange(file);
  }

  blur(): void {
    this._onTouched();
  }
}
