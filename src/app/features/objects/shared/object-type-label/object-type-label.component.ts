import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-object-type-label',
  standalone: true,
  template: `
    <span class="object-type-label">
      @if (icon(); as source) {
        <img class="object-type-icon" [src]="source" alt="" />
      }
      {{ type() }}
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectTypeLabelComponent {
  readonly type = input.required<string>();
  readonly icon = computed(() =>
    ['Organization', 'Sector', 'Department', 'Section'].includes(this.type())
      ? `assets/images/${this.type() === 'Department' ? 'hierarchies' : this.type()}.svg`
      : null,
  );
}
