import { EventTypes } from '../interfaces/Events';

export class UserSigninRequiredEvent extends Event {
  constructor() {
    super(EventTypes.userSigninRequired);
  }
}
