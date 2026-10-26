import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from '../../../../../../../../../../../../shared/ui/button/button.directive';
import { DialogComponent } from '../../../../../../../../../../../../shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-relationship-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonDirective, DialogComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './relationship-dialog.component.html',
  styleUrl: './relationship-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationshipDialogComponent {
  readonly closed = output<void>();
}
