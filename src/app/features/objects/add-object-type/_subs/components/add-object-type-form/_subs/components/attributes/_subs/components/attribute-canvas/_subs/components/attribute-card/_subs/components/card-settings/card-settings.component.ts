import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from '../../../../../../../../../../../../../../../../../../shared/ui/button/button.directive';
import { DialogComponent } from '../../../../../../../../../../../../../../../../../../shared/ui/dialog/dialog.component';

@Component({
  selector: 'app-card-settings',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonDirective, DialogComponent],
  templateUrl: './card-settings.component.html',
  styleUrl: './card-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSettingsComponent implements OnInit {
  private readonly _builder = new FormBuilder().nonNullable;
  readonly value = input.required<{ title: string; backgroundColor: string }>();
  readonly saved = output<{ title: string; backgroundColor: string }>();
  readonly dismissed = output<void>();
  readonly form = this._builder.group({
    title: '',
    backgroundColor: ['#FFFFFF', Validators.pattern(/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i)],
  });

  ngOnInit(): void {
    this.form.patchValue(this.value());
  }

  get color(): string {
    const color = this.form.controls.backgroundColor.value;
    if (this.form.controls.backgroundColor.invalid || !color) return '#ffffff';
    return color.length === 4
      ? `#${color
          .slice(1)
          .split('')
          .map((value) => `${value}${value}`)
          .join('')}`
      : color;
  }

  setColor(value: string): void {
    this.form.controls.backgroundColor.setValue(value);
    this.form.controls.backgroundColor.markAsDirty();
  }

  save(): void {
    if (!this.form.controls.backgroundColor.value)
      this.form.controls.backgroundColor.setValue('#FFFFFF');
    this.form.markAllAsTouched();
    if (this.form.valid) this.saved.emit(this.form.getRawValue());
  }
}
