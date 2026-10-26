import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AttributeInputForm } from '../../../../../../../../../../../../attribute-input-form.model';
import { AdvancedPreviewService } from '../../../../../../../../../../../../advanced-preview.service';
interface TablePreview {
  rows: string[][];
  draft: FormArray<FormControl<string>>;
}
@Component({
  selector: 'app-dynamic-grid',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-grid.component.html',
  styleUrl: './dynamic-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicGridComponent implements OnInit {
  private readonly _container = inject(ControlContainer);
  private readonly _previews = inject(AdvancedPreviewService);
  private readonly _destroy = inject(DestroyRef);
  private readonly _changeDetector = inject(ChangeDetectorRef);
  state!: TablePreview;
  get group(): AttributeInputForm {
    return this._container.control as AttributeInputForm;
  }
  ngOnInit(): void {
    this.state = this._previews.stateFor(this.group, () => ({
      rows: [],
      draft: new FormArray<FormControl<string>>(
        this.group.controls.columns.value.map(() => new FormControl('', { nonNullable: true })),
      ),
    }));
    this.group.controls.columns.valueChanges
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe((columns) => {
        this.state.rows = this.state.rows.map(() => []);
        this.state.draft = new FormArray(
          columns.map(() => new FormControl('', { nonNullable: true })),
        );
        this._changeDetector.markForCheck();
      });
  }
  addRow(): void {
    this.state.rows.push(this.state.draft.getRawValue());
  }
  removeRow(index: number): void {
    this.state.rows.splice(index, 1);
  }
}
