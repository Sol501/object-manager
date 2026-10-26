import { computed, Directive, input } from '@angular/core';

@Directive({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  host: {
    class:
      'btn app-button',
    '[class]': '_variantClasses()',
  },
})
export class ButtonDirective {
  readonly appButton = input<
    '' | 'primary' | 'outline' | 'secondary' | 'submit' | 'draft' | 'cancel' | 'next' | 'previous'
  >('primary');

  protected readonly _variantClasses = computed(() => {
    const regular = 'button-regular';
    const compact =
      'button-compact icon-btn btn-width';
    switch (this.appButton()) {
      case 'next':
        return `${compact} action-button`;
      case 'previous':
        return `${compact} action-button-previous`;
      case 'submit':
        return `${compact} search-btn`;
      case 'draft':
        return `${compact} advance-search`;
      case 'cancel':
        return `${compact} btn-secondary`;
      case 'outline':
        return `${regular} btn-outline-primary`;
      case 'secondary':
        return `${regular} btn-light`;
      default:
        return `${regular} btn-primary`;
    }
  });
}
