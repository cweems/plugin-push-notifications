import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import CustomTaskListComponent from './CustomTaskListComponent';

const PLUGIN_NAME = 'PushNotificationsPlugin';

export default class PushNotificationsPlugin extends FlexPlugin {

  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */


  init(flex, manager) {
    let permission;
    let registration;
    let currentTasks = [];

    function taskListener() {
      let nextState = manager.store.getState();
      let nextTasks = Array.from(nextState.flex.worker.tasks.keys())

      for(var i = 0; i < nextTasks.length; i++) {
        if (!currentTasks.includes(nextTasks[i])) {
          currentTasks = nextTasks;
          if(registration) {
            showLocalNotification('New Flex Task', 'this is the message', registration);
          }
          console.log('New task')
        }
      }
    }

    const requestNotificationPermission = async () => {
        const permission = await window.Notification.requestPermission();
        // value of permission can be 'granted', 'default', 'denied'
        // granted: user has accepted the request
        // default: user has dismissed the notification permission popup by clicking on x
        // denied: user has denied the request.
        if(permission !== 'granted'){
            throw new Error('Permission not granted for Notification');
        }
    }

    function showLocalNotification(title, body, swRegistration) {
      const options = {
          body,
          // here you can add more properties like icon, image, vibrate, etc.
      };

      swRegistration.showNotification(title, options);
    }

    function registerServiceWorker() {
      if (!('serviceWorker' in navigator)) {
        return;
      }

      if (!('PushManager' in window)) {
        return;
      }

      return navigator.serviceWorker.register('/agent-desktop/service-worker.js')
      .then(function(reg) {
        console.log('Service worker successfully registered.');
        registration = reg;
        permission = requestNotificationPermission();
        return registration;
      })
      .catch(function(err) {
        console.error('Unable to register service worker.', err);
      });
    }

    registerServiceWorker();
    const listen = manager.store.subscribe(taskListener);

    flex.AgentDesktopView.Panel1.Content.add(
      <CustomTaskListComponent key="demo-component" />,
      {
        sortOrder: -1,
      }
    );
  }
}
