import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { TableDirective } from '../../../../../../../../../shared/ui/table/table.directive';
import { RowActionsMenuComponent } from '../../../../../../../../../shared/ui/row-actions-menu/row-actions-menu.component';
import { ResponsibilityDialogComponent } from './_subs/components/responsibility-dialog/responsibility-dialog.component';

@Component({
  selector: 'app-responsibilities',
  standalone: true,
  imports: [TableDirective, RowActionsMenuComponent, ResponsibilityDialogComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './responsibilities.component.html',
  styleUrl: './responsibilities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsibilitiesComponent {
  readonly active = input(true);
  readonly busy = input(false);
  readonly dialogOpen = signal(false);
  readonly rows = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    userName: 'Mohammad Abdulrahman',
    responsibility: 'Edit',
  }));

  constructor() {
    effect(() => {
      if (!this.active() || this.busy()) {
        this.dialogOpen.set(false);
      }
    });
  }
}
