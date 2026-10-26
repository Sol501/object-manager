import {
  afterEveryRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AttributeTab } from '../../../../../../../../../../../../core/object-types/object-type.models';

@Component({
  selector: 'app-attribute-tabs',
  standalone: true,
  templateUrl: './attribute-tabs.component.html',
  styleUrl: './attribute-tabs.component.scss',
  host: { '(window:resize)': 'updateScroll()' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeTabsComponent {
  private readonly _strip = viewChild.required<ElementRef<HTMLElement>>('strip');
  private _lastActiveId = '';
  readonly tabs = input.required<readonly AttributeTab[]>();
  readonly activeId = input.required<string>();
  readonly disabled = input(false);
  readonly selected = output<string>();
  readonly edited = output<string>();
  readonly removed = output<string>();
  readonly added = output<void>();
  readonly canScrollLeft = signal(false);
  readonly canScrollRight = signal(false);

  constructor() {
    afterEveryRender(() => {
      const strip = this._strip().nativeElement;
      if (this._lastActiveId !== this.activeId()) {
        this._lastActiveId = this.activeId();
        const active = strip.querySelector<HTMLElement>('.tab-item.active');
        if (active) {
          const left = active.offsetLeft;
          if (left < strip.scrollLeft) strip.scrollLeft = left;
          if (left + active.offsetWidth > strip.scrollLeft + strip.clientWidth) {
            strip.scrollLeft = left + active.offsetWidth - strip.clientWidth;
          }
        }
      }
      this.updateScroll();
    });
  }

  updateScroll(): void {
    const strip = this._strip().nativeElement;
    this.canScrollLeft.set(strip.scrollLeft > 1);
    this.canScrollRight.set(strip.scrollLeft + strip.clientWidth < strip.scrollWidth - 1);
  }

  scroll(direction: number): void {
    const strip = this._strip().nativeElement;
    strip.scrollBy({ left: direction * strip.clientWidth * 0.75, behavior: 'smooth' });
  }
}
