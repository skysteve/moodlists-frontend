
import * as components from './components';
import {NavBar} from './components/NavBar';
import { EventTypes } from './interfaces/Events';
import { UserDataLoadedEvent } from './events/UserDataLoadedEvent';

// we need to pass in components to make TS/rollup happy the files are being used
function init(componentList: any) {
  const elContainer = document.getElementById('main-content') as HTMLDivElement;

  window.addEventListener(EventTypes.userData, (event: UserDataLoadedEvent) => {
    elContainer.innerHTML = '<seed-list></seed-list>';
  });

  // this just stop TS complaining about unused vars
  return new NavBar();
}

// if the document has already loaded - just call init, otherwise wait until it's ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init(components);
} else {
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
      init(components);
    }
  });
}
