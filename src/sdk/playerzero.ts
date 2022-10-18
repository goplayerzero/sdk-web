interface PlayerZeroWindow {
  identify: (userId: string, metadata?: {
    name?: string,
    email?: string,
    group?: string,
    [key: string]: unknown
  }) => void;
  setUserVars: (metadata: Record<string, unknown>) => void;
  track: (event: string, metadata?: Record<string, unknown>) => void;
  prompt: () => void;
  generateDevtoolsUrl: () => Promise<string>;
  kill: () => void;
}

declare global {
  interface Window {
    playerzero: PlayerZeroWindow
  }
}

export class PlayerZeroSdk implements PlayerZeroWindow {

  init(
    projectId: string,
    endpoint: string = 'https://go.playerzero.app'
  ){
    if(window.playerzero){
      console.warn('PlayerZero has already been initialized. PlayerZero.init() can only be called once.');
      return;
    }
    const head = document.getElementsByTagName("head").item(0);

    if(!head) {
      setTimeout(() => this.init(projectId, endpoint), 100);
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", `${endpoint}/record/${projectId}`);
    script.setAttribute("crossorigin", "anonymous");
    head.appendChild(script);
  }

  isInitialized(): boolean {
    return Boolean(window.playerzero);
  }

  identify(userId: string, metadata?: {
    name?: string,
    email?: string,
    group?: string,
    [key: string]: unknown
  }) {
    this.playerzero.then((sdk) => sdk.identify(userId, metadata));
  }

  track(event: string, metadata?: Record<string, unknown>){
    this.playerzero.then((sdk) => sdk.track(event, metadata));
  }

  setUserVars(metadata: Record<string, unknown>){
    this.playerzero.then((sdk) => sdk.setUserVars(metadata));
  }

  prompt(){
    this.playerzero.then((sdk) => sdk.prompt());
  }

  generateDevtoolsUrl(): Promise<string> {
    return this.playerzero.then((sdk) => sdk.generateDevtoolsUrl());
  }

  kill(){
    return this.playerzero.then((sdk) => sdk.kill());
  }

  private get playerzero(): Promise<PlayerZeroWindow> {
    if(window.playerzero) return Promise.resolve(window.playerzero);
    else return new Promise((resolve, reject) => {
      window.addEventListener('playerzero_ready', () => {
        if(window.playerzero) resolve(window.playerzero);
        else reject();
      }, { once: true });
    });
  }

}