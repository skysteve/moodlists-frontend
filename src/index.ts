
import {SpotifyHelper} from './SpotifyHelper';
import {LoadingIcon} from './components/icons/LoadingIcon';
import {NavBar} from './components/NavBar';
import {SearchBar} from './components/SearchBar';
import {SignInModal} from './components/modals/SignInModal';

function registerComponents() {
  customElements.define('loading-icon', LoadingIcon);

  customElements.define('search-bar', SearchBar, {extends: 'input'});
  customElements.define('sign-in-modal', SignInModal);
}

function init() {
  const spotifyHelper = new SpotifyHelper();
  const navBar = new NavBar();
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
