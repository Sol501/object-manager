import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  Injector,
	output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ObjectFormValue, ObjectInfoOptions } from '../../../../../../core/objects/object.models';
import { ObjectInfoComponent } from './_subs/components/object-info/object-info.component';
import { OBJECT_FORM_STEPS } from './add-object-form.model';
import { ActionsStepComponent } from './_subs/components/actions/actions-step.component';
import { LinkedKpisComponent } from './_subs/components/linked-kpis/linked-kpis.component';
import { SubordinatesComponent } from './_subs/components/subordinates/subordinates.component';

@Component({
  selector: 'app-add-object-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ObjectInfoComponent,
    SubordinatesComponent,
    LinkedKpisComponent,
    ActionsStepComponent,
  ],
	templateUrl: './add-object-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddObjectFormComponent {
  private readonly _builder = inject(FormBuilder).nonNullable;
	private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _injector = inject(Injector);
  private readonly _activeStep = signal(0);
  private readonly _furthestStep = signal(0);

  readonly steps = OBJECT_FORM_STEPS;
  readonly activeStep = this._activeStep.asReadonly();
  readonly furthestStep = this._furthestStep.asReadonly();
  readonly options = input.required<ObjectInfoOptions>();
  readonly busy  = input(false);
  readonly submitted = output<ObjectFormValue>();
  readonly draftRequested = output<ObjectFormValue>();
  readonly edited = output<void>();
  readonly form = this._builder.group({
    objectInfo: this._builder.group({
      objectTypeId: ['',Validators.required],
      code: ['', [Validators.required, Validators.pattern(/\S/)]],
      name: ['', [Validators.required, Validators.pattern(/\S/)]],
      nameAr: '',
      nameZh: '',
      responsiblePersonId: '',
      responsibilityId: '',
      bypass:false,
    }),
    subordinates: this._builder.group({ selectedIds: this._builder.control<string[]>([]) }),
    linkedKpis: this._builder.group({ selectedIds: this._builder.control<string[]>([]) }),
    actions: this._builder.group({ selectedIds: this._builder.control<string[]>([]) }),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.edited.emit());
  }

  canNavigateTo(step: number): boolean {
    return (
      !this.busy() &&
      Number.isInteger(step) &&
      step >= 0 &&
      step < this.steps.length &&
      step <= this._furthestStep() + 1
    );
  }

  goToStep(step: number): void {
    if ( !this.canNavigateTo(step) || step === this._activeStep()) {
      return;
    }

    if (step > this._furthestStep() && !this._validateSteps(step)) {
      return;
   }

    this._activeStep.set(step);
    this._furthestStep.update((furthest) => Math.max(furthest, step));
   }

  next(): void {
    if (
      !this.busy() &&
      this._activeStep() < this.steps.length - 1 &&
      this._validateSteps(this._activeStep() + 1)
    ) {
      this.goToStep(this._activeStep() + 1);
    }
 }

  previous(): void {
    this.goToStep(this._activeStep() - 1);
  }

  submit(): void {
    if (this.busy()) {
      return;
     }
    if (this._activeStep() !== this.steps.length - 1) {
      this.next();
      return;
    }
    if (!this._validateSteps(this.steps.length)) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
   }

   saveDraft(): void {
    if (!this.busy() && this._activeStep() === this.steps.length - 1) {
      this.draftRequested.emit(this.form.getRawValue());
    }
  }

  private _validateSteps(count: number): boolean {
    const invalidStep  = this.steps.slice(0, count).findIndex(({ key }) => {
      const group = this.form.controls[key];
      return group.invalid || group.pending;
    });
    if (invalidStep === -1) {
     return true;
    }

    const key =  this.steps[invalidStep].key;
   this.form.controls[key].markAllAsTouched();
    this._activeStep.set(invalidStep);
    afterNextRender(
      () => {
       this._element.nativeElement
          .querySelector<HTMLElement>(
            `#object-step-${key} input.ng-invalid, #object-step-${key} select.ng-invalid, #object-step-${key} app-searchable-select.ng-invalid button`,
          )
          ?.focus();
     },
      { injector: this._injector },
    );
     return false;
  }
}
