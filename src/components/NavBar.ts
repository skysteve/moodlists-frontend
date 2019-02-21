import {SignInModal} from './modals/SignInModal';
import { EventTypes } from '../interfaces/Events';

export class NavBar {
  private el: HTMLElement;
  private user: any; // TODO - not any

  constructor() {
    this.el = document.querySelector('nav.navbar') as HTMLElement;

    const elSignIn = this.el.querySelector('#nav-sign-in') as HTMLAnchorElement;

    elSignIn.addEventListener('click', this.onSignupClick);
    window.addEventListener(EventTypes.userData, this.onUserDataLoaded.bind(this));
  }

  private onSignupClick(event: MouseEvent) {
    event.preventDefault();

    const signInModal = new SignInModal();
    document.body.appendChild(signInModal);
  }

  private onUserDataLoaded(event: CustomEvent): void {
    this.user = event.detail;

    // TODO - hide the sign in, show a template with user data in it
    const elSignIn = this.el.querySelector('#nav-sign-in') as HTMLAnchorElement;
    elSignIn.textContent = this.user.display_name;
  }
}
