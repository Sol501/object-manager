import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { TableDirective } from '../../../../../../../../../shared/ui/table/table.directive';
import { RowActionsMenuComponent } from '../../../../../../../../../shared/ui/row-actions-menu/row-actions-menu.component';
import { ObjectTypeActionsDialogComponent } from './_subs/components/actions-dialog/actions-dialog.component';

@Component({
  selector: 'app-object-type-actions',
  standalone: true,
  imports: [TableDirective, RowActionsMenuComponent, ObjectTypeActionsDialogComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectTypeActionsComponent {
  readonly active = input(true);
  readonly busy = input(false);
  readonly dialogOpen = signal(false);
  readonly rows = Array.from({ length: 6 }, (_, index) => index);

  constructor() {
    effect(() => {
      if (!this.active() || this.busy()) this.dialogOpen.set(false);
    });
  }
}
