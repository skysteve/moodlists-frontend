
import {SpotifyHelper} from './SpotifyHelper';
import {LoadingIcon} from './components/icons/LoadingIcon';
import {NavBar} from './components/NavBar';
import {SearchBar} from './components/SearchBar';
import {SignInModal} from './components/modals/SignInModal';
import {SeedList} from './components/sections/SeedList';
import { EventTypes } from './interfaces/Events';
import { UserDataLoadedEvent } from './events/UserDataLoadedEvent';

function registerComponents() {
  customElements.define('loading-icon', LoadingIcon);
  customElements.define('search-bar', SearchBar, {extends: 'input'});
  customElements.define('sign-in-modal', SignInModal);
  customElements.define('seed-list', SeedList);
}

function init() {
  const spotifyHelper = new SpotifyHelper();
  const navBar = new NavBar();

  const elContainer = document.getElementById('main-content') as HTMLDivElement;

  window.addEventListener(EventTypes.userData, (event: UserDataLoadedEvent) => {
    elContainer.innerHTML = '';
    elContainer.appendChild(new SeedList(spotifyHelper));
  });

  // this just stop TS complaining about unused vars
  return [spotifyHelper, navBar];
}

// register components first
registerComponents();

// if the document has already loaded - just call init, otherwise wait until it's ready
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
} else {
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
      init();
    }
  });
}
