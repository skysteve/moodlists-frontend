
import * as components from './components';
import {NavBar} from './components/NavBar';
import { EventTypes } from './interfaces/Events';
import { UserDataLoadedEvent } from './events/UserDataLoadedEvent';
import { UserSigninRequiredEvent } from './events/UserSigninRequiredEvent';
import { SectionElement } from './components/ui-elements/SectionElement';

// we need to pass in components to make TS/rollup happy the files are being used
function init(componentList: any) {
  const elContainer = document.getElementById('main-content') as HTMLDivElement;

  window.addEventListener(EventTypes.userData, (event: UserDataLoadedEvent) => {
    elContainer.innerHTML = '<section-seed-list></section-seed-list><section-knobs-panel collapsed></section-knobs-panel>';
  });

  window.addEventListener(EventTypes.userSigninRequired, (event: UserSigninRequiredEvent) => {
    elContainer.innerHTML = '<h1>TODO - welcome, please sign in</h1>';
  });

  window.addEventListener(EventTypes.allSeedsSelectedEvent, () => {
    const elSeedList = elContainer.querySelector('section-seed-list') as SectionElement;
    elSeedList.collapseSection();
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
