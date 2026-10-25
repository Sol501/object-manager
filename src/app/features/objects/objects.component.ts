import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-objects',
  host: { class: 'd-block' },
  styleUrl: './objects.component.scss',
  templateUrl: './objects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectsComponent {
  private readonly _auth = inject(AuthFacade);

  logout(): void {
    this._auth.logout();
  }
}
