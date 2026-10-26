import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AttributeLanguage } from '../../../../../../../../../../../../core/object-types/object-type.models';
import {
  ATTRIBUTE_LANGUAGES,
  AttributeTabSettings,
  createTabTranslation,
} from '../../../attributes-form.model';
import { ButtonDirective } from '../../../../../../../../../../../../shared/ui/button/button.directive';
import { DialogComponent } from '../../../../../../../../../../../../shared/ui/dialog/dialog.component';
import { MultiSelectComponent } from '../../../../../../../../../../../../shared/ui/multi-select/multi-select.component';

@Component({
  selector: 'app-tab-settings',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonDirective, DialogComponent, MultiSelectComponent],
  templateUrl: './tab-settings.component.html',
  styleUrl: './tab-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabSettingsComponent implements OnInit {
  private readonly _builder = new FormBuilder().nonNullable;
  readonly value = input.required<AttributeTabSettings>();
  readonly saved = output<AttributeTabSettings>();
  readonly dismissed = output<void>();
  readonly section = signal<'general' | 'security'>('general');
  readonly languages = ATTRIBUTE_LANGUAGES;
  readonly personas = [1, 2, 3, 4].map((id) => ({ id: `${id}`, label: `Persona ${id}` }));
  readonly roles = [1, 2, 3, 4].map((id) => ({ id: `${id}`, label: `Role ${id}` }));
  readonly form = this._builder.group({
    translations: new FormArray([createTabTranslation()]),
    personaIds: this._builder.control<string[]>([]),
    roleIds: this._builder.control<string[]>([]),
  });

  ngOnInit(): void {
    const value = this.value();
    this.form.setControl(
      'translations',
      new FormArray(value.translations.map(createTabTranslation)),
    );
    this.form.patchValue({ personaIds: [...value.personaIds], roleIds: [...value.roleIds] });
  }

  addLanguage(): void {
    const language = this.languages.find((value) => !this.languageUsed(value, -1));
    if (language)
      this.form.controls.translations.push(
        createTabTranslation({ language, title: '', description: '' }),
      );
  }

  removeLanguage(index: number): void {
    if (index > 0) this.form.controls.translations.removeAt(index);
  }

  languageUsed(language: AttributeLanguage, index: number): boolean {
    return this.form.controls.translations.controls.some(
      (group, position) => position !== index && group.controls.language.value === language,
    );
  }

  save(): void {
    this.saved.emit(this.form.getRawValue());
  }
}
