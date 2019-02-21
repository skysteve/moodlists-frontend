import { IWorkerMessage, MessageType } from '../../interfaces/WorkerMessage';
import { ApiHelper } from './ApiHelper';

const apiHelper = new ApiHelper();

onmessage = async function onmessage(event: MessageEvent) {
  const messageBody = event.data as IWorkerMessage;
  const messageId = messageBody.messageId;
  let response: any = {};
  console.log('Got a message', messageBody);

  try {
    switch (messageBody.type) {
      case MessageType.connected:
        break; // don't actually need to do anything here
      case  MessageType.createPlaylist:
        if (!messageBody.playlistData) {
          throw new Error('playlistData must exist to create a playlist');
        }
        response = await apiHelper.createPlaylist(messageBody.playlistData);
        break;
      case MessageType.loadRecommendations:
          response = await apiHelper.loadRecommendations(messageBody.artists, messageBody.knobs);
          break;
      case MessageType.search:
        if (!messageBody.searchQuery) {
          throw new Error('Message body should contain a search query for type "search"');
        }

        const { query, type } = messageBody.searchQuery;
        response = await apiHelper.search(query, type);
        break;
    }
  } catch (error) {
    return postMessage({
      error,
      messageId,
      type: MessageType.error
    });
  }

  postMessage({
    data: response,
    messageId,
    type: messageBody.type
  });
};

if (!apiHelper.hasAuthToken()) {
  postMessage({
    type: MessageType.authRequired,
    data: {
      authUrl: apiHelper.authUrl
    }
  });
} else {
  apiHelper.getUserData()
    .then((user) => {
      postMessage({
        type: MessageType.userData,
        data: {
          user
        }
      });
    })
    .catch((ex) => {
      console.error('Failed to load user data', ex);
      postMessage({
        ex,
        type: MessageType.error
      });
    });
}
