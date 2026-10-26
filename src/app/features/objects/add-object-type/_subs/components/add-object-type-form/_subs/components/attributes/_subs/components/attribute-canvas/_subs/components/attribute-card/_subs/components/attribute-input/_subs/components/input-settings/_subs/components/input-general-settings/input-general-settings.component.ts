import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import {
  AttributeInputForm,
  createInputTranslation,
} from '../../../../../../../../../../../../../../../attribute-input-form.model';
import { ATTRIBUTE_LANGUAGES } from '../../../../../../../../../../../../../../../attributes-form.model';
import { AttributeLanguage } from '../../../../../../../../../../../../../../../../../../../../../../../../core/object-types/object-type.models';
import { ToggleSwitchComponent } from '../../../../../../../../../../../../../../../../../../../../../../../../shared/ui/toggle-switch/toggle-switch.component';
@Component({
  selector: 'app-input-general-settings',
  standalone: true,
  imports: [ReactiveFormsModule, ToggleSwitchComponent],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './input-general-settings.component.html',
  styleUrl: './input-general-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGeneralSettingsComponent {
  private readonly _container = inject(ControlContainer);
  get group(): AttributeInputForm {
    return this._container.control as AttributeInputForm;
  }
  readonly referenceOnly = input(false);
  readonly languages = ATTRIBUTE_LANGUAGES;
  addLanguage(): void {
    const language = this.referenceOnly()
      ? 'English'
      : this.languages.find((value) => !this.languageUsed(value, -1));
    if (language)
      this.group.controls.translations.push(
        createInputTranslation({ language, label: '', description: '' }),
      );
  }
  languageUsed(language: AttributeLanguage, index: number): boolean {
    if (this.referenceOnly()) return false;
    return this.group.controls.translations.controls.some(
      (translation, position) =>
        position !== index && translation.controls.language.value === language,
    );
  }
  removeLanguage(index: number): void {
    if (index > 0) this.group.controls.translations.removeAt(index);
  }
}
