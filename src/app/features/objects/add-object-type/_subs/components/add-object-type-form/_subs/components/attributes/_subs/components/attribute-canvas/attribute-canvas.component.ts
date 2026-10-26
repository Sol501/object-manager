import { clearInputReferences } from '../../../attribute-input-form.model';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { AttributeCardLayout } from '../../../../../../../../../../../../core/object-types/object-type.models';
import { AttributeTabForm, createAttributeCard } from '../../../attributes-form.model';
import { AttributeCardComponent } from './_subs/components/attribute-card/attribute-card.component';
import { CardPosition, firstFreeRow, placeCard } from './attribute-layout';

interface CardGesture {
  id: string;
  mode: 'move' | 'resize';
  pointerId: number;
  startX: number;
  startY: number;
  columnSize: number;
  rowSize: number;
  positions: CardPosition[];
}

@Component({
  selector: 'app-attribute-canvas',
  standalone: true,
  imports: [ReactiveFormsModule, AttributeCardComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  host: {
    '(document:pointermove)': 'movePointer($event)',
    '(document:pointerup)': 'finishPointer($event)',
    '(document:pointercancel)': 'cancelGesture()',
    '(document:keydown.escape)': 'cancelGesture()',
    '(window:resize)': 'cancelGesture()',
  },
  templateUrl: './attribute-canvas.component.html',
  styleUrl: './attribute-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeCanvasComponent {
  private readonly _container = inject(ControlContainer);
  private readonly _document = inject(DOCUMENT);
  private readonly _canvas = viewChild.required<ElementRef<HTMLElement>>('canvas');
  private _gesture: CardGesture | null = null;
  readonly preview = signal<CardPosition[] | null>(null);

  get group(): AttributeTabForm {
    return this._container.control as AttributeTabForm;
  }

  get cards() {
    return this.group.controls.cards;
  }

  layout(index: number): AttributeCardLayout {
    const card = this.cards.at(index);
    return (
      this.preview()?.find((item) => item.id === card.controls.id.value) ??
      card.controls.layout.getRawValue()
    );
  }

  addCard(): void {
    if (this.group.disabled) return;
    const card = createAttributeCard();
    card.controls.layout.controls.row.setValue(firstFreeRow(this._positions()));
    this.cards.push(card);
    this.group.markAsDirty();
  }

  removeCard(index: number): void {
    if (this.group.disabled) return;
    this.cancelGesture();
    const removedIds = this.cards
      .at(index)
      .controls.inputs.controls.map((input) => input.controls.id.value);
    this.cards.removeAt(index);
    clearInputReferences(this.group.root, removedIds);
    this.group.markAsDirty();
  }

  startPointer(index: number, event: PointerEvent, mode: 'move' | 'resize'): void {
    const view = this._document.defaultView!;
    if (
      this.group.disabled ||
      event.button !== 0 ||
      view.matchMedia('(max-width: 56.25rem)').matches
    )
      return;
    event.preventDefault();
    const canvas = this._canvas().nativeElement;
    const rem = Number.parseFloat(view.getComputedStyle(this._document.documentElement).fontSize);
    const positions = this._positions();
    this._gesture = {
      id: this.cards.at(index).controls.id.value,
      mode,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      columnSize: (canvas.clientWidth + 0.625 * rem) / 6,
      rowSize: 9.375 * rem,
      positions,
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.preview.set(positions);
  }

  movePointer(event: PointerEvent): void {
    const gesture = this._gesture;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (this.group.disabled) {
      this.cancelGesture();
      return;
    }
    const original = gesture.positions.find((item) => item.id === gesture.id)!;
    const horizontal = Math.round((event.clientX - gesture.startX) / gesture.columnSize);
    const vertical = Math.round((event.clientY - gesture.startY) / gesture.rowSize);
    const layout =
      gesture.mode === 'move'
        ? {
            ...original,
            column: Math.max(1, Math.min(7 - original.columns, original.column + horizontal)),
            row: Math.max(1, original.row + vertical),
          }
        : {
            ...original,
            columns: Math.max(1, Math.min(7 - original.column, original.columns + horizontal)),
            rows: Math.max(1, original.rows + vertical),
          };
    this.preview.set(placeCard(gesture.positions, gesture.id, layout));
  }

  finishPointer(event: PointerEvent): void {
    if (this._gesture?.pointerId !== event.pointerId) return;
    const positions = this.preview();
    if (positions && !this.group.disabled) this._applyPositions(positions);
    this.cancelGesture();
  }

  changeWithKeyboard(index: number, event: KeyboardEvent, mode: 'move' | 'resize'): void {
    if (
      this.group.disabled ||
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    )
      return;
    event.preventDefault();
    const card = this.cards.at(index);
    const layout = { ...card.controls.layout.getRawValue() };
    const horizontal = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    const vertical = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (mode === 'move') {
      layout.column = Math.max(1, Math.min(7 - layout.columns, layout.column + horizontal));
      layout.row = Math.max(1, layout.row + vertical);
    } else {
      layout.columns = Math.max(1, Math.min(7 - layout.column, layout.columns + horizontal));
      layout.rows = Math.max(1, layout.rows + vertical);
    }
    this._applyPositions(placeCard(this._positions(), card.controls.id.value, layout));
  }

  cancelGesture(): void {
    this._gesture = null;
    this.preview.set(null);
  }

  private _positions(): CardPosition[] {
    return this.cards.controls.map((card) => ({
      id: card.controls.id.value,
      ...card.controls.layout.getRawValue(),
    }));
  }

  private _applyPositions(positions: CardPosition[]): void {
    let changed = false;
    for (const card of this.cards.controls) {
      const position = positions.find((item) => item.id === card.controls.id.value)!;
      const { id, ...layout } = position;
      if (JSON.stringify(card.controls.layout.getRawValue()) !== JSON.stringify(layout)) {
        card.controls.layout.setValue(layout, { emitEvent: false });
        changed = true;
      }
    }
    if (changed) {
      this.cards.updateValueAndValidity();
      this.cards.markAsDirty();
    }
  }
}
