import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { RangeCustomEvent } from '@ionic/angular';
import { RangeValue, TimespanChangeEvent, TimespanComponentStore } from './timespan.component.store';
import { numberToTime } from '../../functions/timespan';

@Component({
  selector: 'app-timespan',
  templateUrl: './timespan.component.html',
  styleUrls: ['./timespan.component.scss'],
  providers: [TimespanComponentStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimespanComponent implements OnChanges {
  @Input() start: string; // e.g. '12:00'
  @Input() stop: string;
  @Output() timespanChange = new EventEmitter<TimespanChangeEvent>();

  initialValue: RangeValue;

  constructor(readonly componentStore: TimespanComponentStore) {}

  ngOnChanges() {
    this.componentStore.initialize(this.start, this.stop);

    this.initialValue = this.componentStore.getInitialValue();
  }

  onChange(e: Event) {
    const customEvent = e as RangeCustomEvent;
    this.componentStore.move(customEvent.detail.value as RangeValue);
    this.timespanChange.emit(this.componentStore.getTimespanChangeEvent());
  }

  onKnobMoveStart(e: Event) {
    const customEvent = e as RangeCustomEvent;
    this.componentStore.startMove(customEvent.detail.value as RangeValue);
  }

  onKnobMoveEnd(e: Event) {
    const customEvent = e as RangeCustomEvent;
    this.componentStore.stopMove(customEvent.detail.value as RangeValue);
  }

  pinFormatter = (value: number) => {
    return numberToTime(value);
  };
}
