import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

interface Step {
  key: string;
  label: string;
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  host: { class: 'd-block' },
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  readonly steps = input.required<readonly Step[]>();
  readonly activeStep = input(0);
  readonly availableThrough = input(0);
  readonly disabled = input(false);
  readonly stepSelected = output<number>();
}
