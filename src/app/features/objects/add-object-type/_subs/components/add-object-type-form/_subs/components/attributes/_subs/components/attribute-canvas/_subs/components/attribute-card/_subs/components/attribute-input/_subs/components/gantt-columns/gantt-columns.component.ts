import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { ButtonDirective } from '../../../../../../../../../../../../../../../../../../../../../shared/ui/button/button.directive';

@Component({
  selector: 'app-gantt-columns',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent, ButtonDirective],
  templateUrl: './gantt-columns.component.html',
  styleUrl: './gantt-columns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttColumnsComponent implements OnInit {
  readonly value = input.required<string[]>();
  readonly saved = output<string[]>();
  readonly dismissed = output<void>();
  readonly columns = new FormArray<FormControl<string>>([]);
  readonly choices = [
    { value: 'title', label: 'Subject' },
    { value: 'start', label: 'Start Date' },
    { value: 'end', label: 'End Date' },
    { value: 'progress', label: 'Progress' },
  ];
  ngOnInit(): void {
    for (const column of this.value())
      this.columns.push(new FormControl(column, { nonNullable: true }));
  }
  add(): void {
    this.columns.push(new FormControl('title', { nonNullable: true }));
  }
}
