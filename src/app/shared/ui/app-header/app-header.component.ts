import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonDirective } from '../button/button.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonDirective],
  styleUrl: './app-header.component.scss',
  templateUrl: './app-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  readonly logout = output<void>();
}
