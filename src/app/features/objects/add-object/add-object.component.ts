import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
   viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../../core/auth/auth.facade.service';
import { AppHeaderComponent } from '../../../shared/ui/app-header/app-header.component';
import { ButtonDirective } from '../../../shared/ui/button/button.directive';
import { StepperComponent } from '../../../shared/ui/stepper/stepper.component';
import { AddObjectFormComponent } from './_subs/components/add-object-form/add-object-form.component';
import { OBJECT_FORM_STEPS } from './_subs/components/add-object-form/add-object-form.model';
import { AddObjectFacade } from './_subs/services/add-object.facade.service';

@Component( {
  selector: 'app-add-object',
  standalone: true,
  imports: [RouterLink, AppHeaderComponent, ButtonDirective, StepperComponent, AddObjectFormComponent],
  providers: [AddObjectFacade],
  host: { class: 'd-block' },
  styleUrl: './add-object.component.scss',
  templateUrl: './add-object.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddObjectComponent implements OnInit {
  private readonly _auth = inject(AuthFacade);
  readonly objectForm = viewChild(AddObjectFormComponent);
  readonly facade = inject(AddObjectFacade);
  readonly steps = OBJECT_FORM_STEPS;
  readonly activeStep = computed(() => this.objectForm()?.activeStep() ?? 0);

  ngOnInit(): void {
    this.facade.loadOptions();
  }

  logout(): void {
    this._auth.logout();
  }
}
