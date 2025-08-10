# PlayerZero Web SDK

PlayerZero's browser SDK lets you manage PlayerZero on your site as well as
generate links to devtools and send your own custom events. More information about the PlayerZero API can be found
at https://docs.playerzero.app.

## Install the SDK

**with npm**

```shell
npm i @goplayerzero/sdk-web --save
```

**with yarn**

```shell
yarn add @goplayerzero/sdk-web
```

## Initialize the SDK

Call the `init()` function with your Project ID as soon as you can in your website startup process.
Calling init a second time after successful initialization will trigger console warnings -
if you need to programmatically check if PlayerZero has been initialized at some point in your code, you can call
`PlayerZero.isInitialized()`.

### PlayerZero API

* `PlayerZero.init(projectId: string | {endpoint?: string, privacyFnUrl?: string})` - Initialize PlayerZero on your site
  with the specific Project ID. The project id can be found on
  the [Settings > Data Collection page](https://go.playerzero.app/setting/data)
* `PlayerZero.isInitialized(): Boolean` - Check if PlayerZero is initialized in your application.
* `PlayerZero.identify(userId: string, metadata: Record<string, unknown>)` - Identify your user with PlayerZero
* `PlayerZero.setUserVars(metadata: Record<string, unknown>)` - Set user properties & metadata without resetting the
  identity
* `PlayerZero.track(event: string, metadata?: Record<string, unknown>)` - Send an analytics event to PlayerZero
* `PlayerZero.prompt()` - Prompt the user to upload their Devtools Report
* `PlayerZero.devtoolsUrl(): Promise<string>` - Generate a Devtools URL for the current session
* `PlayerZero.kill()` - Shut down PlayerZero immediately. PlayerZero cannot be reinitialized after this is called.

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

```javascript
PlayerZero.track(
  'checkout',
  { item: 'chocolate' }
);
```

### Generate a Devtools URL

```javascript
PlayerZero.devtoolsUrl().then(url => console.log('PlayerZero Devtools URL', url));
```


