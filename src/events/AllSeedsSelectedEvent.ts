import { EventTypes } from '../interfaces/Events';

export class AllSeedsSelectedEvent extends Event {
  constructor() {
    super(EventTypes.allSeedsSelectedEvent, {bubbles: true});
  }
}
