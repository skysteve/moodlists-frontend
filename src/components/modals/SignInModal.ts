import {AbstractModal} from './Abstract';
import {TokensLoadedEvent} from '../../events/TokensLoadedEvent';

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

    // not using event types here because we're using super basic JS in the iframe
    elIframe.addEventListener('loadedTokens', this.onTokensLoaded.bind(this));

    return clone;
  }

  public get title() {
    return 'Sign in to Spotify';
  }

  private onTokensLoaded(event: CustomEvent): void {
    if (!event.detail || !event.detail.access_token) {
      // not actually sure how you'd get here, but best to say something rather than silence
      return alert('Failed to log in to Spotify');
    }


    this.closeModal();
    const loadedEvent = new TokensLoadedEvent(event.detail);
    window.dispatchEvent(loadedEvent);
  }

}

customElements.define('sign-in-modal', SignInModal);
