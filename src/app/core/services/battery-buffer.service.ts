import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';


@Injectable({ providedIn: 'root' })
export class BatteryBufferService {
  constructor(private readonly alertController: AlertController, private readonly toastController: ToastController) {}

  async show(value: string, header: string) {
    const alert = await this.alertController.create({
      header,
      subHeader: 'Please input the buffer level as a percentage (0-100%)',
      cssClass: 'ion-alert-custom',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: async (input) => {

            const bufferInput = input.buffer === '' ? '0' : input.buffer?.toString() || '';
            const bufferLevel = parseInt(bufferInput, 10); // Parse the string as an integer
            
            if (!isNaN(bufferLevel) && bufferLevel >= 0 && bufferLevel <= 100) {
              return true; // Valid input
            }

            const toast = await this.toastController.create({
              message: 'Invalid value. Please enter a percentage between 0 and 100.',
              duration: 2000,
              position: 'bottom',
              color: 'danger',
            });

            await toast.present();
            return false;
          },
        },
      ],
      inputs: [
        {
          name: 'buffer',
          type: 'number',
          placeholder: 'E.g. 50',
          value,
          min: 0,
          max: 100,
        },
      ],
    });

    await alert.present();

    const { role, data } = await alert.onDidDismiss();

    if (role === 'confirm') {
      // Explicitly handle 0 as a valid value
      const bufferInput = data.values.buffer === '' ? '0' : data.values.buffer?.toString() || '';
      const bufferLevel = parseInt(bufferInput, 10); // Parse the string as an integer
      return bufferLevel;
    }

    return null;
  }
}
