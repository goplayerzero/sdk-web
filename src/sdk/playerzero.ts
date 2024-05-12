export interface PlayerZeroWindow {
  init: (projectToken: string, endpoint: string) => void
  identify: (userId: string, metadata?: {
    name?: string,
    email?: string,
    group?: string,
    [key: string]: string | undefined
  }) => void;
  setUserVars: (metadata: Record<string, string | undefined>) => void;
  track: (event: string, metadata?: Record<string, unknown>) => void;
  prompt: () => void;
  devtools: () => Promise<string>;
  kill: () => Promise<boolean>;
}

interface PlayerZeroFetchWrapper {
  // internal flags used to manage network monitoring
  monkey_patch_ts: number;
  before_fetch_apply: (url: RequestInfo | URL, options?: RequestInit) => any;
  after_fetch_apply: (response: Response, beforeResult: any) => any;
}

declare global {
  interface Window {
    playerzero: PlayerZeroWindow & PlayerZeroFetchWrapper
  }
}

export class PlayerZeroSdk implements PlayerZeroWindow {
  private get playerzero(): Promise<PlayerZeroWindow> {
    if (Boolean(window?.playerzero?.kill)) return Promise.resolve(window.playerzero);
    else return new Promise((resolve, reject) => {
      window.addEventListener('playerzero_ready', () => {
        if (Boolean(window?.playerzero?.kill)) resolve(window.playerzero);
        else reject();
      }, { once: true });
    });
  }

  init(
    projectToken: string,
    endpoint: string = 'https://go.playerzero.app'
  ) {
    if (this.isInitialized()) {
      console.warn('PlayerZero has already been initialized. PlayerZero.init() can only be called once.');
      return;
    }
    this.injectFetchWrappers();
    const head = document.getElementsByTagName("head").item(0);
    if (!head) {
      setTimeout(() => this.init(projectToken, endpoint), 100);
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", `${endpoint}/record/${projectToken}`);
    script.setAttribute("crossorigin", "anonymous");
    head.appendChild(script);
  }

  private injectFetchWrappers(){
    const originalFetch = window.fetch;
    if (!window["playerzero"]) {
      // @ts-ignore
      window["playerzero"] = {};
    }

    window.playerzero.monkey_patch_ts = performance.now();

    window.fetch = function (url: RequestInfo | URL, options?: RequestInit) { // preserve arity
      if (
          Boolean(window.playerzero) &&
          Boolean(window.playerzero.before_fetch_apply) &&
          Boolean(window.playerzero.after_fetch_apply)
      ) {
        // create a copy of request info
        const urlCopy = typeof url === 'string' ? url : {...url};
        const passedOpts = options || {};
        const beforeFetchApplyResult = window.playerzero.before_fetch_apply(urlCopy, passedOpts);
        // console.log(options.headers);
        // graphql aborts all of their responses; the promise wrapping allows us to get the response text before fetch is aborted
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line prefer-rest-params
          originalFetch(url, passedOpts)
              .then((response) => {
                window.playerzero.after_fetch_apply(response, beforeFetchApplyResult)
                    .catch(() => {})
                    .finally(() => resolve(response));
              })
              .catch(e => reject(e));
        });
      } else return originalFetch(url, options);
    };
  }

  isInitialized(): boolean {
    return Boolean(window.playerzero?.kill);
  }

  identify(userId: string, metadata?: {
    name?: string,
    email?: string,
    group?: string,
    [key: string]: string | undefined
  }) {
    this.playerzero.then((sdk) => sdk.identify(userId, metadata));
  }

  setUserVars(metadata: Record<string, string | undefined>) {
    this.playerzero.then((sdk) => sdk.setUserVars(metadata));
  }

  track(event: string, metadata?: Record<string, unknown>) {
    this.playerzero.then((sdk) => sdk.track(event, metadata));
  }

  prompt() {
    this.playerzero.then((sdk) => sdk.prompt());
  }

  devtools(): Promise<string> {
    return this.playerzero.then((sdk) => sdk.devtools());
  }

  kill(): Promise<boolean> {
    return this.playerzero.then((sdk) => sdk.kill());
  }
}
