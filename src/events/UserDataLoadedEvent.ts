import { EventTypes } from '../interfaces/Events';

export class UserDataLoadedEvent extends CustomEvent<{}> {
  constructor(userData: any) { // TODO - not any
    super(EventTypes.userData, {
      detail: userData
    });
  }

  public get user() {
    return this.detail;
  }
}
