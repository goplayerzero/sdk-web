# PlayerZero Web SDK

The PlayerZero Web SDK enables you to integrate PlayerZero into your website or web application. With this SDK, you can
manage PlayerZero initialization, identify users, track custom analytics events, generate DevTools links, and more. For
comprehensive API documentation,
visit [PlayerZero Docs](https://playerzero.ai/docs/developer-guide/configuration-guides/capturing-user-sessions/npm).

---

## Installation

Install the SDK using your preferred package manager:

**npm**

```shell
npm i @goplayerzero/sdk-web --save
```

**with yarn**

```shell
yarn add @goplayerzero/sdk-web
```

## Initialize the SDK

Calling `init()` more than once after successful initialization will trigger console warnings. To check if PlayerZero
has already been initialized, use `PlayerZero.isInitialized()`.

### PlayerZero API

* `PlayerZero.init(projectId: string, options: {endpoint?: string, privacyFnUrl?: string})` - Initialize PlayerZero with
  your Project ID and optional configuration. The project id can be found on [PlayerZero's](https://playerzero.ai)
  `Project Settings` under the `Web SDK` area.
* `PlayerZero.isInitialized(): Boolean` - Returns `true` if PlayerZero is initialized.
* `PlayerZero.identify(userId: string, metadata: Record<string, unknown>)` - Identify the current user and associate
  metadata.
* `PlayerZero.setUserVars(metadata: Record<string, unknown>)` - Update user properties and metadata without resetting
  the identity.
* `PlayerZero.track(event: string, metadata?: Record<string, unknown>)` - Track a custom analytics event with optional
  metadata.
* `PlayerZero.prompt()` - Prompt the user to interact with their DevTools report.
* `PlayerZero.devtoolsUrl(): Promise<string>` - Generate a DevTools URL for the current session.
* `PlayerZero.kill()` - Immediately shut down PlayerZero. This action is irreversible for the session.

### Examples

#### React

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import PlayerZero from '@goplayerzero/sdk-web';

PlayerZero.init('<your project id here>');

ReactDOM.render(<App/>, document.getElementById('root'));
```

#### Angular - `main.ts`

```javascript
import { Component } from '@angular/core';
import PlayerZero from '@goplayerzero/sdk-web';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    PlayerZero.init('<your project id here>');
  }
}
```

#### Vue

```javascript
import Vue from 'vue';
import App from './App.vue';
import PlayerZero from '@goplayerzero/sdk-web';

PlayerZero.init('<your project id here>');
Vue.prototype.$PlayerZero = PlayerZero;

new Vue({
  render: h => h(App)
}).$mount('#app');
```

#### Vue 3

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import PlayerZero from '@goplayerzero/sdk-web';

PlayerZero.init('<your project id here>');

const app = createApp(App);
app.config.globalProperties.$PlayerZero = PlayerZero;
app.mount('#app');
```

## Using the SDK

Once PlayerZero is initialized, you can make calls to the PlayerZero SDK.

### Identify a User

Associate a user and their metadata with PlayerZero:

```javascript
PlayerZero.identify(
  'userId',
  {
    name: 'Billy Joel',
    email: 'billy@joel.com',
    group: 'Pied Piper'
  }
);
```

### Track custom analytics events

Send custom events to PlayerZero for analytics:

```javascript
PlayerZero.track(
  'checkout',
  { item: 'chocolate' }
);
```

### Generate a DevTools URL

Create a DevTools URL for the current session:

```javascript
PlayerZero.devtoolsUrl().then(url => console.log('PlayerZero Devtools URL', url));
```

## Additional Information

* For advanced configuration and troubleshooting, refer to the [official documentation](https://playerzero.ai).
* If you need to stop PlayerZero during a session, call PlayerZero.kill(). Note that reinitialization is not possible
  after calling this method.

## Support

For questions or support, please contact [PlayerZero Support](mailto:support@playerzero.ai).
