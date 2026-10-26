import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  styleUrl: './searchable-select.component.scss',
  templateUrl: './searchable-select.component.html',
  host: {
    class: 'position-relative d-block',
    '(focusout)': 'onFocusOut($event)',
    '(document:pointerdown)': 'onOutsidePointerDown($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableSelectComponent implements ControlValueAccessor {
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _injector = inject(Injector);
  private readonly _trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly _search = viewChild<ElementRef<HTMLInputElement>>('search');
  private _onChange: (value: string) => void = () => undefined;
  private _onTouched: () => void = () => undefined;

  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption[]>();
  readonly placeholder = input('Select');
  readonly showPlaceholder = input(true);
  readonly invalid = input(false);
  readonly describedBy = input<string | null>(null);
  readonly value = signal('');
  readonly disabled = signal(false);
  readonly opened = signal(false);
  readonly query = signal('');
  readonly activeIndex = signal(0);
  readonly selectedLabel = computed(
    () => this.options().find((option) => option.id === this.value())?.label ?? this.placeholder(),
  );
  readonly filteredOptions = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return query
      ? this.options().filter((option) => option.label.toLocaleLowerCase().includes(query))
      : this.showPlaceholder()
        ? [{ id: '', label: this.placeholder() }, ...this.options()]
        : this.options();
  });

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
    if (disabled) {
      this.close();
    }
  }

  toggle(): void {
    if (this.opened()) {
      this.close(true);
    } else {
      this.open();
    }
  }

  open(): void {
    if (this._isDisabled() || this.opened()) {
      return;
    }
    this.query.set('');
    this.activeIndex.set(
      Math.max(
        0,
        this.filteredOptions().findIndex((option) => option.id === this.value()),
      ),
    );
    this.opened.set(true);
    afterNextRender(
      () => {
        this._search()?.nativeElement.focus();
        this._scrollActiveOption();
      },
      { injector: this._injector },
    );
  }

  close(restoreFocus = false): void {
    if (restoreFocus) {
      this._trigger()?.nativeElement.focus();
    }
    this.opened.set(false);
  }

  filter(query: string): void {
    this.query.set(query);
    this.activeIndex.set(0);
  }

  select(option: SelectOption): void {
    if (this._isDisabled()) {
      return;
    }
    if (option.id !== this.value()) {
      this.value.set(option.id);
      this._onChange(option.id);
    }
    this.close(true);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.open();
    }
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.isComposing) {
      return;
    }
    if (event.key === 'Escape' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
      this.close(true);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const option = this.filteredOptions()[this.activeIndex()];
      if (option) {
        this.select(option);
      }
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      this.activeIndex.update((index) =>
        Math.max(0, Math.min(index + direction, this.filteredOptions().length - 1)),
      );
      afterNextRender(() => this._scrollActiveOption(), { injector: this._injector });
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (!this._element.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.close();
      this._onTouched();
    }
  }

  onOutsidePointerDown(event: PointerEvent): void {
    if (this.opened() && !this._element.nativeElement.contains(event.target as Node | null)) {
      this.close();
      this._onTouched();
    }
  }

  private _isDisabled(): boolean {
    return this.disabled() || this._trigger()?.nativeElement.matches(':disabled') === true;
  }

  private _scrollActiveOption(): void {
    this._element.nativeElement
      .querySelector<HTMLElement>(`[data-option-index="${this.activeIndex()}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }
}
