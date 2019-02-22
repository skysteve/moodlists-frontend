import {SignInModal} from './modals/SignInModal';
import { EventTypes } from '../interfaces/Events';
import { UserDataLoadedEvent } from '../events/UserDataLoadedEvent';
import { UserSigninRequiredEvent } from '../events/UserSigninRequiredEvent';
import { ISpotifyUser } from '../interfaces/spotify/SpotifyUser';

export class NavBar {
  private el: HTMLElement;
  private user: ISpotifyUser | undefined;

  constructor() {
    this.el = document.querySelector('nav.navbar') as HTMLElement;

    window.addEventListener(EventTypes.userData, this.onUserDataLoaded.bind(this));
    window.addEventListener(EventTypes.userSigninRequired, this.onUserSigninRequired.bind(this));
  }

  private onSignupClick(event: MouseEvent) {
    event.preventDefault();

    const signInModal = new SignInModal();
    document.body.appendChild(signInModal);
  }

  private onUserDataLoaded(event: UserDataLoadedEvent): void {
    this.user = event.user;

    const elSignIn = this.elSignIn;
    elSignIn.textContent = this.user.display_name;
    elSignIn.setAttribute('target', '_blank');
    elSignIn.setAttribute('href', this.user.external_urls.spotify);
  }

  private onUserSigninRequired(event: UserSigninRequiredEvent): void {
    const elSignIn = this.elSignIn;
    elSignIn.textContent = 'Sign in Spotify';
    elSignIn.addEventListener('click', this.onSignupClick);
  }

  private get elSignIn(): HTMLAnchorElement {
    return this.el.querySelector('#nav-sign-in') as HTMLAnchorElement;
  }
}
