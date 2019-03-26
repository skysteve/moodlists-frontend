import {AbstractModal} from './Abstract';
import { spotifyHelperInstance } from '../../SpotifyHelper';
import { IWorkerMessage, MessageType } from '../../interfaces/WorkerMessage';
import { ITrack } from '../../interfaces/spotify/SpotifyRecommendations';

const template = document.createElement('template');
template.innerHTML = /*html*/`
<fieldset>
  <div class="field">
    <label class="label">Playlist Name</label>
    <div class="control">
      <input class="input" type="text" placeholder="e.g. My Awesome Playlist">
    </div>
  </div>
  <div class="field">
    <label class="label">Description</label>
    <div class="control">
      <textarea class="textarea" placeholder="Description"></textarea>
    </div>
  </div>
  <div class="field">
  <div class="control">
    <label class="checkbox">
      <input type="checkbox" id="cb-play-now">
      Play now
    </label>
  </div>
</div>
</fieldset>
<button class="button is-primary">Create</button>
`;

export class CreatePlaylistModal extends AbstractModal {
  private tracks: ITrack[];

  constructor(tracks: ITrack[]) {
    super();

    this.tracks = tracks;
  }

  protected renderContent(): DocumentFragment {
    // Instantiate the table with the existing HTML tbody
    // and the row with the template
    const clone = document.importNode(template.content, true);

    const elBtnCreate = clone.querySelector('button') as HTMLButtonElement;
    elBtnCreate.addEventListener('click', this.onCreateClick.bind(this));


    return clone;
  }

  public get title() {
    return 'Create Playlist';
  }

  private async onCreateClick(event: MouseEvent) {
    event.stopPropagation();

    const elName = this.querySelector('input') as HTMLInputElement;
    const title = elName.value.trim();

    const elDescription = this.querySelector('textarea') as HTMLTextAreaElement;
    const description = elDescription.value.trim() || 'Created by recommendation station';

    const elPlayNow = this.querySelector('#cb-play-now') as HTMLInputElement;
    const playNow = elPlayNow.checked;

    if (!title) {
      // TODO - this could be a cleaner message in the UI somewhere
      alert('No Name specified');
      return;
    }

    if (!this.tracks || this.tracks.length < 1) {
      return;
    }

    const message: IWorkerMessage = { type: MessageType.createPlaylist, playlistData: {
      title,
      description,
      tracks: this.tracks.map((track) => track.uri),
      playNow
    }};

    const result = await spotifyHelperInstance.makeRequest(message);

    // if successful - close the modal
    if (result && result.success) {
      this.remove();
      alert('Playlist created');
    } else {
      alert('Failed to create playlist');
    }
  }

}

customElements.define('create-playlist-modal', CreatePlaylistModal);
