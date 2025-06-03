import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlatformActions } from '../../store/platform';
import { SettingsPageStore } from './settings-page.store';
import { ConfigurationKey, OperatingMode } from '../../api/models/battery.model';
import { SonnenBatterieActions } from '../../store/sonnen-batterie';
import { InputActions } from '../../store/input/input.actions';
import { Platform, ToggleChangeEventDetail } from '@ionic/angular';
import { IpService } from '../../core/services/ip.service';
import { MaxPowerService } from '../../core/services/max-power.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { BatteryBufferService } from '../../core/services/battery-buffer.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings-page.component.html',
  styleUrls: ['settings-page.component.scss'],
  providers: [SettingsPageStore],
})
export class SettingsPage implements OnInit {
  operatingModes = [
    OperatingMode.TimeOfUse,
    OperatingMode.SelfConsumption,
    OperatingMode.BatteryModuleExtension,
    OperatingMode.Manual,
  ];

  OperatingMode = OperatingMode;

  presentingElement = null;

  constructor(
    private readonly store: Store,
    readonly componentStore: SettingsPageStore,
    private readonly platform: Platform,
    private readonly confirmService: ConfirmService,
    private readonly ipService: IpService,
    private readonly maxPowerService: MaxPowerService,
    private readonly bufferLevelService: BatteryBufferService
  ) {}

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-content');
  }

  ionViewWillEnter() {
    this.store.dispatch(SonnenBatterieActions.refreshConfigurations());
  }

  setOperatingMode(operatingMode: OperatingMode) {
    this.componentStore.toggleOperatingModeModal(false);

    this.store.dispatch(
      SonnenBatterieActions.setConfiguration({ key: ConfigurationKey.EM_OperatingMode, configuration: operatingMode })
    );
  }

  changeBatteryMaxOutput(value: string) {
    this.maxPowerService.show(value, 'Battery max power').then((batteryMaxPower) => {
      if (batteryMaxPower && batteryMaxPower.toString() !== value) {
        this.store.dispatch(InputActions.setBatteryMaxPower({ batteryMaxPower }));
      }
    });
  }

  changeSolarMaxOutput(value: string) {
    this.maxPowerService.show(value, 'Solar max output').then((solarMaxPower) => {
      if (solarMaxPower && solarMaxPower.toString() !== value) {
        this.store.dispatch(InputActions.setSolarMaxPower({ solarMaxPower }));
      }
    });
  }

  changeBatteryBufferLevel(value: string) {
    // Ensure `value` is explicitly passed as a string, even if it's "0"
    const inputValue = value ?? ''; // Fallback to an empty string if `value` is null or undefined

    this.bufferLevelService.show(inputValue, 'Battery buffer level').then((batteryBufferLevel) => {
      if (batteryBufferLevel !== null && batteryBufferLevel.toString() !== value) {
        this.store.dispatch(  
          SonnenBatterieActions.setConfiguration({ key: ConfigurationKey.EM_USOC, configuration: batteryBufferLevel.toString() })
        );
      }
    });
  }

  changeIp(ip: string) {
    this.ipService.show(ip).then((lanIp) => {
      if (lanIp && lanIp !== ip) {
        this.store.dispatch(SonnenBatterieActions.setLanIp({ lanIp }));
      }
    });
  }

  setDarkMode(e: Event) {
  const customEvent = e as CustomEvent<ToggleChangeEventDetail>;
  this.store.dispatch(
    InputActions.setDarkMode({ enabled: customEvent.detail.checked })
  );
  }

  setPrognosisCharging(e: Event) {
    const customEvent = e as CustomEvent<ToggleChangeEventDetail>;
    this.store.dispatch(
      SonnenBatterieActions.setConfiguration({
        key: ConfigurationKey.EM_Prognosis_Charging,
        configuration: customEvent.detail.checked ? '1' : '0',
      })
    );
  }

  async resetConfirm() {
    this.confirmService.confirm('Reset', 'This will clear all data and restart the setup').then((confirm) => {
      if (confirm) {
        this.runWizard();
      }
    });
  }

  runWizard() {
    this.store.dispatch(PlatformActions.runWizard());

    if (!this.platform.url().startsWith('http')) {
      // When running on device also clear all input
      this.store.dispatch(InputActions.clearInput());
    }
  }
}
