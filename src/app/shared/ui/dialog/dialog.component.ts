import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  styleUrl: './dialog.component.scss',
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnDestroy {
  private readonly _document = inject(DOCUMENT);
  private readonly _dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private _previousFocus: HTMLElement | null = null;
  readonly title = input.required<string>();
  readonly titleId = input.required<string>();
  readonly panel = input<'modal' | 'side' | 'side-small'>('modal');
  readonly size = input<'standard' | 'medium' | 'large'>('large');
  readonly showHeader = input(true);
  readonly dismissed = output<void>();

  constructor() {
    afterNextRender(() => {
      this._previousFocus = this._document.activeElement as HTMLElement | null;
      this._dialog().nativeElement.showModal();
    });
  }

  ngOnDestroy(): void {
    this._dialog().nativeElement.close();
    this._previousFocus?.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    const target = event.target;
    if (
      event.key === 'Enter' &&
      target instanceof HTMLInputElement &&
      target.form &&
      !this._dialog().nativeElement.contains(target.form)
    ) {
      event.preventDefault();
    }
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      this.dismissed.emit();
    }
  }
}
