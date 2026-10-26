import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AttributeInputForm } from '../../../../../../../../../../../../attribute-input-form.model';
import { AdvancedPreviewService } from '../../../../../../../../../../../../advanced-preview.service';
import { DialogComponent } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { ButtonDirective } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/button/button.directive';
import { BOARD_COLUMNS } from './board-data';
@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent, ButtonDirective],
  templateUrl: './tasks-board.component.html',
  styleUrl: './tasks-board.component.scss',
  host: {
    '(document:pointermove)': 'moveCard($event)',
    '(document:pointerup)': 'finishMove($event)',
    '(document:pointercancel)': 'cancelMove()',
    '(keydown.escape)': 'cancelMove()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksBoardComponent implements OnInit {
  private readonly _container = inject(ControlContainer);
  private readonly _previews = inject(AdvancedPreviewService);
  private readonly _host = inject<ElementRef<HTMLElement>>(ElementRef);
  private _pointerId: number | null = null;
  private _targetCard: string | null = null;
  private _nextColumn = 4;
  readonly moving = signal<string | null>(null);
  readonly targetColumn = signal<string | null>(null);
  readonly naming = signal<string | null>(null);
  readonly title = new FormControl('', { nonNullable: true });
  readonly filters = ['My Tasks', 'Assigned By Me', 'Followed By Me', 'Created By Me', 'Completed'];
  columns: typeof BOARD_COLUMNS = [];
  ngOnInit(): void {
    this.columns = this._previews.stateFor(this._container.control as AttributeInputForm, () =>
      structuredClone(BOARD_COLUMNS),
    );
    this._nextColumn = Math.max(3, ...this.columns.map((column) => Number(column.id))) + 1;
  }
  addColumn(): void {
    const id = `${this._nextColumn++}`;
    this.columns.push({ id, title: 'Column Title', cards: [] });
    this.title.setValue('');
    this.naming.set(id);
  }
  saveColumn(): void {
    const column = this.columns.find((column) => column.id === this.naming());
    if (column) column.title = this.title.value;
    this.naming.set(null);
  }
  removeColumn(index: number): void {
    this.columns.splice(index, 1);
  }
  removeCard(columnIndex: number, cardIndex: number): void {
    this.columns[columnIndex].cards.splice(cardIndex, 1);
  }
  startMove(id: string, event: PointerEvent): void {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    this._pointerId = event.pointerId;
    this.moving.set(id);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  moveCard(event: PointerEvent): void {
    if (event.pointerId !== this._pointerId) return;
    const host = this._host.nativeElement;
    const target = host.ownerDocument.elementFromPoint(event.clientX, event.clientY);
    const column = target?.closest<HTMLElement>('[data-board-column]');
    this.targetColumn.set(
      column && host.contains(column) ? (column.dataset['boardColumn'] ?? null) : null,
    );
    this._targetCard =
      target?.closest<HTMLElement>('[data-board-card]')?.dataset['boardCard'] ?? null;
  }
  finishMove(event: PointerEvent): void {
    if (event.pointerId !== this._pointerId) return;
    const from = this.columns.find((column) =>
      column.cards.some((card) => card.id === this.moving()),
    );
    const to = this.columns.find((column) => column.id === this.targetColumn());
    if (from && to && this._targetCard !== this.moving()) {
      const index = from.cards.findIndex((card) => card.id === this.moving());
      const [card] = from.cards.splice(index, 1);
      const target = to.cards.findIndex((card) => card.id === this._targetCard);
      to.cards.splice(target < 0 ? to.cards.length : target, 0, card);
    }
    this.cancelMove();
  }
  cancelMove(): void {
    this._pointerId = null;
    this._targetCard = null;
    this.moving.set(null);
    this.targetColumn.set(null);
  }
}
