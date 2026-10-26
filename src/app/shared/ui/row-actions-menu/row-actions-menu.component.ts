import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
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

export interface RowMenuItem {
  id: string;
  label: string;
  danger?: boolean;
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
  readonly label = input.required<string>();
  readonly menuId = input.required<string>();
  readonly disabled = input(false);
  readonly showEdit = input(false);
  readonly items = input<readonly RowMenuItem[] | null>(null);
  readonly selected = output<string>();
  readonly edited = output<void>();
  readonly removed = output<void>();
  readonly position = signal<MenuPosition | null>(null);
  readonly menuItems = computed<readonly RowMenuItem[]>(() => this.items() ?? [
    ...(this.showEdit() ? [{ id: 'edit', label: 'Edit' }] : []),
    { id: 'remove', label: 'Remove', danger: true },
  ]);

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
    const menuHeight = 1.25 + this.menuItems().length * 1.5;
    this.position.set({
      top:
        rect.bottom / rem + menuHeight + 0.25 < view.innerHeight / rem
          ? rect.bottom / rem + 0.25
          : rect.top / rem - menuHeight,
      left: Math.max(0.25, Math.min(rect.right / rem - 5.625, view.innerWidth / rem - 10.25)),
    });
    afterNextRender(() => this._menu()?.nativeElement.querySelector<HTMLButtonElement>('button')?.focus(), {
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

  select(item: RowMenuItem): void {
    if (!this.disabled()) {
      this.closeMenu();
      this.selected.emit(item.id);
      if (!this.items()) {
        if (item.id === 'edit') this.edited.emit();
        else this.removed.emit();
      }
    }
  }

  moveFocus(event: Event, offset: number): void {
    event.preventDefault();
    const buttons = Array.from(this._menu()?.nativeElement.querySelectorAll('button') ?? []);
    const index = buttons.indexOf(this._document.activeElement as HTMLButtonElement);
    buttons[Math.max(0, Math.min(index + offset, buttons.length - 1))]?.focus();
  }
}
