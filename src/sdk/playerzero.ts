interface PlayerZeroWindow {
  identify: (userId: string, metadata: Record<string, unknown>) => void;
  setUserVars: (metadata: Record<string, unknown>) => void;
  track: (event: string, metadata?: Record<string, unknown>) => void;
  prompt: () => void;
  devtoolsUrl: () => Promise<string>;
  kill: () => void;
}

declare global {
  interface Window {
    playerzero: PlayerZeroWindow
  }
}

class PlayerZeroWrapper {

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

  identify(userId: string, metadata: Record<string, unknown>) {
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

  devtoolsUrl(): Promise<string> {
    return this.playerzero.then((sdk) => sdk.devtoolsUrl());
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

const PlayerZero = new PlayerZeroWrapper();
export default PlayerZero;