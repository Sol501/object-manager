import { AdvancedPreviewService } from './advanced-preview.service';
import { AttributePreviewService } from './attribute-preview.service';
import { clearInputReferences } from './attribute-input-form.model';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ControlContainer, FormArray, ReactiveFormsModule } from '@angular/forms';
import {
  AttributesForm,
  AttributeTabSettings,
  createAttributeTab,
  createTabTranslation,
} from './attributes-form.model';
import { AttributeTabsComponent } from './_subs/components/attribute-tabs/attribute-tabs.component';
import { AttributeCanvasComponent } from './_subs/components/attribute-canvas/attribute-canvas.component';
import { TabSettingsComponent } from './_subs/components/tab-settings/tab-settings.component';

@Component({
  selector: 'app-attributes',
  providers: [AttributePreviewService, AdvancedPreviewService],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AttributeTabsComponent,
    AttributeCanvasComponent,
    TabSettingsComponent,
  ],
  viewProviders: [
    { provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) },
  ],
  templateUrl: './attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributesComponent {
  private readonly _container = inject(ControlContainer);
  readonly selectedTabId = signal<string | null>(null);
  readonly editingTabId = signal<string | null>(null);

  get group(): AttributesForm {
    return this._container.control as AttributesForm;
  }

  get tabs() {
    return this.group.controls.tabs;
  }

  get activeTabId(): string {
    return this.selectedTabId() ?? this.tabs.at(0).controls.id.value;
  }

  get editingTab() {
    return this.tabs.controls.find((tab) => tab.controls.id.value === this.editingTabId());
  }

  addTab(): void {
    if (this.group.disabled) return;
    const tab = createAttributeTab();
    this.tabs.push(tab);
    this.group.markAsDirty();
    this.selectedTabId.set(tab.controls.id.value);
    this.editingTabId.set(tab.controls.id.value);
  }

  removeTab(id: string): void {
    if (this.group.disabled) return;
    const index = this.tabs.controls.findIndex((tab) => tab.controls.id.value === id);
    if (index <= 0) return;
    const removedIds = this.tabs
      .at(index)
      .controls.cards.controls.flatMap((card) =>
        card.controls.inputs.controls.map((input) => input.controls.id.value),
      );
    this.tabs.removeAt(index);
    clearInputReferences(this.group.root, removedIds);
    this.group.markAsDirty();
    this.selectedTabId.set(this.tabs.at(0).controls.id.value);
  }

  saveTab(value: AttributeTabSettings): void {
    const tab = this.editingTab;
    if (!tab || this.group.disabled) return;
    tab.setControl('translations', new FormArray(value.translations.map(createTabTranslation)));
    tab.patchValue({ personaIds: value.personaIds, roleIds: value.roleIds });
    tab.markAsDirty();
    this.editingTabId.set(null);
  }
}
