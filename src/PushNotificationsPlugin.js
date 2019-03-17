import { FlexPlugin } from 'flex-plugin';
// import React from 'react';

const PLUGIN_NAME = 'PushNotificationsPlugin';

export default class PushNotificationsPlugin extends FlexPlugin {

  constructor(flex, manager) {
    super(PLUGIN_NAME);

    this.currentTasks = [];
    this.manager = null;
    this.registration = null;
    this.permission = null;

    this.registerServiceWorker = this.registerServiceWorker.bind(this);
    this.registerSuccess = this.registerSuccess.bind(this);
    this.init = this.init.bind(this)
  }

  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    if (!('PushManager' in window)) {
      return;
    }

    return navigator.serviceWorker.register('/agent-desktop/service-worker.js')
      .then(function(reg) {
        this.registerSuccess(reg);
      }.bind(this))
      .catch(function(err) {
        console.error('Unable to register service worker.', err);
      });
  }

  registerSuccess(reg) {
    this.registration = reg;
    this.permission = this.requestNotificationPermission();
    console.log('Service worker successfully registered.');

    return this.registration;
  }

  /**
   * Ask for permission to display notifications.
   * value of permission can be 'granted', 'default', 'denied'
   */

  async requestNotificationPermission () {
      const permission = await window.Notification.requestPermission();

      if(permission !== 'granted'){
          throw new Error('Permission not granted for Notification');
      }
  }

  /**
   * Show the push notification to the user.
   * Called by taskListener.
   */

  showLocalNotification(title, task, swRegistration) {
    const body = this.alertMessage(task);

    const options = {
      body,
      "icon": "/img/flex_icon.png",
      // here you can add more properties like icon, image, vibrate, etc.
    };

    if(swRegistration) {
      swRegistration.showNotification(title, options);
    }
  }

  /**
   * Generates the message string that will display in the push alert
   *
   * @param newTask { 'task triggering the push' }
   * @param allTasks { 'all task reservations for user' }
   */

  alertMessage(task) {

    let name = task.task.attributes.name;
    let channel = task.task.attributes.channelType;

    return `New ${channel} task from ${name}`;
  }

  init(flex, manager) {
    this.manager = manager;
    this.registerServiceWorker();

    manager.workerClient.on("reservationCreated", (task) => {
      this.showLocalNotification('Twilio Flex', task, this.registration)
    });
  }
}
