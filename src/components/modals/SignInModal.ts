import {AbstractModal} from './Abstract';

export class SignInModal extends AbstractModal {
  protected renderContent(): DocumentFragment {
    // Instantiate the table with the existing HTML tbody
    // and the row with the template
    const template = document.getElementById('sign-in-modal') as HTMLTemplateElement;
    const clone = document.importNode(template.content, true);
    const elIframe = clone.querySelector('iframe') as HTMLIFrameElement;

    if (!elIframe) {
      throw new Error('Could not find expected iframe');
    }

    elIframe.addEventListener('loadedTokens', this.onTokensLoaded.bind(this));

    return clone;
  }

  protected get title() {
    return 'Sign in to Spotify';
  }

  private onTokensLoaded(event: CustomEvent): void {
    if (event.detail && event.detail.access_token) {
      this.closeModal();
      this.storeTokens(event.detail);
      return;
    }

    // not actually sure how you'd get here, but best to say something rather than silence
    alert('Failed to log in to Spotify');
  }

  private storeTokens(tokens: {access_token: string, refresh_token: string, expiresAt: string}): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('expires_at', tokens.expiresAt);
  }
}
