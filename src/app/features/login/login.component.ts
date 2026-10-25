import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacade } from '../../core/auth/auth.facade.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  host: { class: 'd-block' },
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly auth = inject(AuthFacade);
  private readonly formBuilder = inject(FormBuilder);

  readonly passwordVisible = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.auth.isLoading()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = this.form.getRawValue();
    this.auth.login({ ...credentials, email: credentials.email.trim() });
  }

  togglePassword(): void {
    this.passwordVisible.update((visible) => !visible);
  }
}
