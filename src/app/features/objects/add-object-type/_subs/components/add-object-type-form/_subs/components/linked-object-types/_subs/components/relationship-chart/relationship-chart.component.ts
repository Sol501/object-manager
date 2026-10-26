import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import Highcharts from 'highcharts/esm/highcharts.js';
import 'highcharts/esm/modules/sankey.js';
import 'highcharts/esm/modules/organization.js';
import 'highcharts/esm/modules/exporting.js';

@Component({
  selector: 'app-relationship-chart',
  standalone: true,
  templateUrl: './relationship-chart.component.html',
  styleUrl: './relationship-chart.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationshipChartComponent {
  private readonly _host = viewChild.required<ElementRef<HTMLElement>>('chart');
  private readonly _destroy = inject(DestroyRef);
  private _chart?: Highcharts.Chart;

  constructor() {
    afterNextRender(() => this._render());
    this._destroy.onDestroy(() => this._chart?.destroy());
  }

  private _render(): void {
    const document = this._host().nativeElement.ownerDocument;
    const rem = Number.parseFloat(
      document.defaultView!.getComputedStyle(document.documentElement).fontSize,
    );
    this._chart = Highcharts.chart(this._host().nativeElement, {
      chart: { height: 15 * rem, inverted: true, backgroundColor: 'transparent' },
      title: { text: '' },
      series: [
        {
          type: 'organization',
          name: '',
          data: [
            { from: 'Organization', to: 'Department1' },
            { from: 'Organization', to: 'Department2' },
            { from: 'Department1', to: 'Section1' },
            { from: 'Department1', to: 'Section2' },
            { from: 'Department2', to: 'Section3' },
            { from: 'Department2', to: 'Section4' },
          ],
          levels: [0, 1, 2, 4].map((level) => ({
            level,
            color: '#EAF4F9',
            borderWidth: 0.125 * rem,
            borderColor: '#008BB5',
            dataLabels: { color: '#434343' },
            ...(level < 2 ? { height: 1.5625 * rem } : {}),
          })),
          nodes: [
            {
              id: 'Organization',
              title: '',
              name: 'Organization',
              image: 'assets/images/archimate icons/outcome-purple.svg',
            },
            {
              id: 'Department1',
              column: 1,
              title: '',
              name: 'Department1',
              image: 'assets/images/archimate icons/location-orange.svg',
            },
            {
              id: 'Department2',
              column: 1,
              title: '',
              name: 'Department2',
              image: 'assets/images/archimate icons/actor-yellow.svg',
            },
            {
              id: 'Section1',
              column: 2,
              title: '',
              name: 'Section1',
              image: 'assets/images/archimate icons/function-green.svg',
            },
            {
              id: 'Section2',
              column: 2,
              title: '',
              name: 'Section2',
              image: 'assets/images/archimate icons/application-component-blue.svg',
            },
            {
              id: 'Section3',
              column: 2,
              title: '',
              name: 'Section3',
              image: 'assets/images/archimate icons/technology-process-green.svg',
            },
            {
              id: 'Section4',
              column: 2,
              title: '',
              name: 'Section4',
              image: 'assets/images/archimate icons/implementation-red.svg',
            },
          ],
          colorByPoint: false,
          color: '#007ad0',
          dataLabels: { color: 'white' },
          borderColor: 'white',
          nodeWidth: 2.1875 * rem,
        } satisfies Highcharts.SeriesOrganizationOptions,
      ],
      tooltip: { outside: true },
      exporting: { allowHTML: true, sourceWidth: 50 * rem, sourceHeight: 37.5 * rem },
    });
  }
}
