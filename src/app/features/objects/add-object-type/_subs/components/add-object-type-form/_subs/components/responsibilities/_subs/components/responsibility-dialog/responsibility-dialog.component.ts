import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from '../../../../../../../../../../../../shared/ui/button/button.directive';
import { DialogComponent } from '../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { SearchableSelectComponent } from '../../../../../../../../../../../../shared/ui/searchable-select/searchable-select.component';

@Component({
  selector: 'app-responsibility-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonDirective, DialogComponent, SearchableSelectComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './responsibility-dialog.component.html',
  styleUrl: './responsibility-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsibilityDialogComponent {
  readonly closed = output<void>();
  readonly usersAndGroups = [
    'Group name1',
    'Group name2',
    'Mohammad Ali',
    'Abdullah Mohammad',
    'Sami Ahmad',
  ].map((name) => ({ id: name, label: name }));
}
