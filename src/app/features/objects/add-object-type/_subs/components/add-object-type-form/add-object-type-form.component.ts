import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  ObjectTypeFormValue,
  ObjectTypeResponsibilities,
  ObjectTypeRelationship,
} from '../../../../../../core/object-types/object-type.models';
import { GeneralInfoComponent } from './_subs/components/general-info/general-info.component';
import { AttributesComponent } from './_subs/components/attributes/attributes.component';
import { createAttributesForm } from './_subs/components/attributes/attributes-form.model';
import { ResponsibilitiesComponent } from './_subs/components/responsibilities/responsibilities.component';
import { LinkedObjectTypesComponent } from './_subs/components/linked-object-types/linked-object-types.component';
import { ObjectTypeActionsComponent } from './_subs/components/actions/actions.component';
import { OBJECT_TYPE_FORM_STEPS } from './add-object-type-form.model';

@Component({
  selector: 'app-add-object-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, GeneralInfoComponent, AttributesComponent, ResponsibilitiesComponent, LinkedObjectTypesComponent, ObjectTypeActionsComponent],
  templateUrl: './add-object-type-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddObjectTypeFormComponent {
  private readonly _builder = inject(FormBuilder).nonNullable;
  private readonly _activeStep = signal(0);
  private readonly _furthestStep = signal(0);

  readonly steps = OBJECT_TYPE_FORM_STEPS;
  readonly activeStep = this._activeStep.asReadonly();
  readonly furthestStep = this._furthestStep.asReadonly();
  readonly busy = input(false);
  readonly submitted = output<ObjectTypeFormValue>();
  readonly draftRequested = output<ObjectTypeFormValue>();
  readonly edited = output<void>();
  readonly form = this._builder.group({
    generalInfo: this._builder.group({
      code: '',
      prefix: '',
      icon: this._builder.control<File | null>(null),
      name: '',
      description: '',
      protected: false,
      measurable: false,
      auditTrail: false,
    }),
    attributes: createAttributesForm(),
    responsibilities: this._builder.group({
      userOrGroupName: 'Group name1',
      responsibility: this._builder.control<ObjectTypeResponsibilities['responsibility']>('View'),
    }),
    linkedObjectTypes: this._builder.group({
      id: '',
      activeName: '',
      passiveName: '',
      targetObjectTypeName: 'Object type name',
      impact: this._builder.control<ObjectTypeRelationship['impact']>('Very high'),
      relation: this._builder.control<ObjectTypeRelationship['relation']>('One to Many'),
    }),
    actions: this._builder.group({
      search: '',
      selection: this._builder.array(
        Array.from({ length: 7 }, () => this._builder.control(false)),
      ),
    }),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.edited.emit());
    effect(() => {
      if (this.busy()) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  goToStep(step: number): void {
    if (
      this.busy() ||
      !Number.isInteger(step) ||
      step < 0 ||
      step >= this.steps.length ||
      step > this._furthestStep() + 1
    ) {
      return;
    }

    if (step > this._furthestStep() && !this._validate(this._activeStep())) {
      return;
    }

    this._activeStep.set(step);
    this._furthestStep.update((furthest) => Math.max(furthest, step));
  }

  next(): void {
    if (!this.busy() && this._validate(this._activeStep())) {
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

    if (this._validate()) {
      this.submitted.emit(this.form.getRawValue());
    }
  }

  saveDraft(): void {
    if (!this.busy() && this._activeStep() === this.steps.length - 1) {
      this.draftRequested.emit(this.form.getRawValue());
    }
  }

  private _validate(step?: number): boolean {
    const groups = [
      this.form.controls.generalInfo,
      this.form.controls.attributes,
      this.form.controls.responsibilities,
      this.form.controls.linkedObjectTypes,
      this.form.controls.actions,
    ];
    const invalidStep = groups.findIndex(
      (group, index) => (step === undefined || index === step) && group.invalid,
    );
    if (invalidStep !== -1) {
      groups[invalidStep].markAllAsTouched();
      this._activeStep.set(invalidStep);
      return false;
    }
    return true;
  }
}
