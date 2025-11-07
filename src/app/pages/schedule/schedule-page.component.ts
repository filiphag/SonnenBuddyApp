import { Component, OnInit } from '@angular/core';
import { SchedulePageStore } from './schedule-page.store';
import { ISchedule, OperatingMode } from '../../api/models/battery.model';
import { SonnenBatterieActions } from '../../store/sonnen-batterie';
import { Store } from '@ngrx/store';
import { TimespanChangeEvent } from '../../shared/components/timespan/timespan.component.store';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-schedule',
  templateUrl: 'schedule-page.component.html',
  styleUrls: ['schedule-page.component.scss'],
  providers: [SchedulePageStore],
})
export class SchedulePage implements OnInit {
  OperatingMode = OperatingMode;

  start: string;
  stop: string;
  threshold: string;

  presentingElement = null;

  constructor(private readonly store: Store, public readonly componentStore: SchedulePageStore) {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-content');
  }

  ionViewWillEnter() {
    this.store.dispatch(SonnenBatterieActions.refreshConfigurations());
  }

  timespanChange(e: TimespanChangeEvent) {
    const { start, stop } = e;
    this.componentStore.updateTimespan({ start, stop });
  }

  thresholdChange(e: Event) {
    const customEvent = e as CustomEvent;
    this.threshold = customEvent.detail.value;
    this.componentStore.updateThreshold(parseInt(this.threshold, 10));
  }

  showAddModal() {
    this.componentStore.firstFreeSlot$
      .pipe(
        take(1),
        tap((firstFree) => {
          // console.log('showAddModal - firstFreeSlot:', firstFree);
        })
      )
      .subscribe((firstFree) => {
      // Use firstFree slot if available, otherwise fall back to literals
      this.start = firstFree?.start ?? '01:00';
      this.stop = firstFree?.stop ?? '05:00';
      this.threshold = '5000';

      const schedule: ISchedule = {
        start: this.start,
        stop: this.stop,
        threshold_p_max: parseInt(this.threshold, 10),
      };

      this.componentStore.showAddModal(schedule);
    });
  }

  showEditModal(schedule: ISchedule) {
    this.start = schedule.start;
    this.stop = schedule.stop;
    this.threshold = schedule.threshold_p_max.toString();

    this.componentStore.showEditModal(schedule);
  }

  save() {
    this.componentStore.save();
  }

  remove() {
    this.componentStore.remove();
  }

  clear() {
    this.componentStore.clear();
  }

  wattFormatter = (value: string) => {
    return value + 'W';
  };
}
