import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../../core/auth/auth.facade.service';
import { AppHeaderComponent } from '../../../shared/ui/app-header/app-header.component';
import { ButtonDirective } from '../../../shared/ui/button/button.directive';
import { StepperComponent } from '../../../shared/ui/stepper/stepper.component';
import { AddObjectTypeFormComponent } from './_subs/components/add-object-type-form/add-object-type-form.component';
import { OBJECT_TYPE_FORM_STEPS } from './_subs/components/add-object-type-form/add-object-type-form.model';
import { AddObjectTypeFacade } from './_subs/services/add-object-type.facade.service';

@Component({
  selector: 'app-add-object-type',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, ButtonDirective, StepperComponent, AddObjectTypeFormComponent],
  providers: [AddObjectTypeFacade],
  host: { class: 'd-block' },
  templateUrl: './add-object-type.component.html',
  styleUrl: './add-object-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddObjectTypeComponent {
  private readonly _auth = inject(AuthFacade);
  readonly facade = inject(AddObjectTypeFacade);
  readonly objectTypeForm = viewChild(AddObjectTypeFormComponent);
  readonly steps = OBJECT_TYPE_FORM_STEPS;
  readonly activeStep = computed(() => this.objectTypeForm()?.activeStep() ?? 0);

  logout(): void {
    this._auth.logout();
  }
}
