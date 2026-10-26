import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

interface MenuPosition {
  top: number;
  left: number;
}

@Component({
  selector: 'app-row-actions-menu',
  standalone: true,
  styleUrl: './row-actions-menu.component.scss',
  templateUrl: './row-actions-menu.component.html',
  host: {
    '(document:click)': 'onOutsideInteraction($event)',
    '(document:focusin)': 'onOutsideInteraction($event)',
    '(document:keydown.escape)': 'onEscape($event)',
    '(window:resize)': 'closeMenu()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActionsMenuComponent {
  private readonly _document = inject(DOCUMENT);
  private readonly _injector = inject(Injector);
  private readonly _trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly _menu = viewChild<ElementRef<HTMLElement>>('menuElement');
  private readonly _removeButton = viewChild<ElementRef<HTMLButtonElement>>('removeButton');
  readonly label = input.required<string>();
  readonly menuId = input.required<string>();
  readonly disabled = input(false);
  readonly removed = output<void>();
  readonly position = signal<MenuPosition | null>(null);

  constructor() {
    effect((onCleanup) => {
      if (this.disabled()) {
        this.closeMenu();
      }
      if (this.position()) {
        const close = () => this.closeMenu();
        this._document.addEventListener('scroll', close, true);
        onCleanup(() => this._document.removeEventListener('scroll', close, true));
      }
    });
  }

  toggleMenu(event: Event): void {
    if (this.position()) {
      this.closeMenu();
    } else {
      this.openMenu(event);
    }
  }

  openMenu(event: Event): void {
    event.preventDefault();
    if (this.disabled()) {
      return;
    }
    const rect = this._trigger().nativeElement.getBoundingClientRect();
    const view = this._document.defaultView!;
    const rem =
      Number.parseFloat(view.getComputedStyle(this._document.documentElement).fontSize) || 16;
    this.position.set({
      top:
        rect.bottom / rem + 3 < view.innerHeight / rem
          ? rect.bottom / rem + 0.25
          : rect.top / rem - 2.75,
      left: Math.max(0.25, Math.min(rect.right / rem - 5.625, view.innerWidth / rem - 10.25)),
    });
    afterNextRender(() => this._removeButton()?.nativeElement.focus(), {
      injector: this._injector,
    });
  }

  closeMenu(): void {
    this.position.set(null);
  }

  onOutsideInteraction(event: Event): void {
    const target = event.target as Node | null;
    if (
      this.position() &&
      !this._trigger().nativeElement.contains(target) &&
      !this._menu()?.nativeElement.contains(target)
    ) {
      this.closeMenu();
    }
  }

  onEscape(event: Event): void {
    if (this.position()) {
      event.preventDefault();
      this.closeMenu();
      this._trigger().nativeElement.focus();
    }
  }

  remove(): void {
    if (!this.disabled()) {
      this.closeMenu();
      this.removed.emit();
    }
  }
}
