import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../searchable-select/searchable-select.component';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  host: {
    class: 'd-block position-relative',
    '(focusout)': 'onFocusOut($event)',
    '(document:pointerdown)': 'onOutside($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent implements ControlValueAccessor {
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private _onChange: (value: string[]) => void = () => undefined;
  private _onTouched: () => void = () => undefined;
  readonly controlId = input.required<string>();
  readonly options = input.required<readonly SelectOption[]>();
  readonly value = signal<string[]>([]);
  readonly disabled = signal(false);
  readonly opened = signal(false);
  readonly query = signal('');
  readonly selected = computed(() =>
    this.options().filter((option) => this.value().includes(option.id)),
  );
  readonly filtered = computed(() =>
    this.options().filter((option) =>
      option.label.toLowerCase().includes(this.query().trim().toLowerCase()),
    ),
  );

  writeValue(value: string[] | null): void {
    this.value.set(value ? [...value] : []);
  }
  registerOnChange(fn: (value: string[]) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
    if (disabled) this.opened.set(false);
  }

  toggle(id: string): void {
    if (this.disabled()) return;
    const values = this.value().includes(id)
      ? this.value().filter((value) => value !== id)
      : [...this.value(), id];
    this.value.set(values);
    this._onChange(values);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.opened()) {
      event.preventDefault();
      event.stopPropagation();
      this.opened.set(false);
    } else if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      const option = this.filtered().find((item) => !this.value().includes(item.id));
      if (option) this.toggle(option.id);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.opened.set(true);
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (!this._element.nativeElement.contains(event.relatedTarget as Node | null)) this._close();
  }

  onOutside(event: Event): void {
    if (this.opened() && !this._element.nativeElement.contains(event.target as Node)) this._close();
  }

  private _close(): void {
    this.opened.set(false);
    this.query.set('');
    this._onTouched();
  }
}
