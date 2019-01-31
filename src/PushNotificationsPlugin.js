import { FlexPlugin } from 'flex-plugin';
import React from 'react';

const PLUGIN_NAME = 'PushNotificationsPlugin';

export default class PushNotificationsPlugin extends FlexPlugin {

  constructor(flex, manager) {
    super(PLUGIN_NAME);

    this.currentTasks = [];
    this.manager = null;
    this.registration = null;
    this.permission = null;

    this.taskListener = this.taskListener.bind(this);
    this.registerServiceWorker = this.registerServiceWorker.bind(this);
    this.registerSuccess = this.registerSuccess.bind(this);
    this.init = this.init.bind(this)
  }

  /**
   * Subscribes to the redux store.
   * Fires a notification when a new task SID is added.
   */

  taskListener() {
     const nextState = this.manager.store.getState();
     const nextTasks = nextState.flex.worker.tasks;
     const nextTaskKeys = Array.from(nextTasks.keys());

     for(let i = 0; i < nextTaskKeys.length; i++) {
       if (!this.currentTasks.includes(nextTaskKeys[i])) {
         this.currentTasks = nextTaskKeys;

         const newTask = nextTaskKeys[i];
         const message = this.alertMessage(newTask, nextTasks);

         if(this.registration) {
           this.showLocalNotification('Twilio Flex', message, this.registration);
         }
         console.log('New task')
       }
     }
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

  showLocalNotification(title, body, swRegistration) {
    const options = {
      body,
      "icon": "/img/flex_icon.png",
      // here you can add more properties like icon, image, vibrate, etc.
    };

    swRegistration.showNotification(title, options);
  }

  /**
   * Generates the message string that will display in the push alert
   *
   * @param newTask { 'task triggering the push' }
   * @param allTasks { 'all task reservations for user' }
   */

  alertMessage(newTask, allTasks) {

    let currentTask = allTasks.get(newTask);
    let name = currentTask._task.attributes.name;
    let channel = currentTask._task.attributes.channelType;

    return `New ${channel} task from ${name}`;
  }

  init(flex, manager) {
    this.manager = manager;
    this.registerServiceWorker();

    const listen = manager.store.subscribe(this.taskListener);
  }
}
