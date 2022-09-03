import type { Services } from 'services';
import type { Api } from 'core/api';
import type { RootController } from 'core/rootController';

import { Main } from './main';
import { AddPlace } from './addPlace';
import { FindPlace } from './findPlace';
import { Debug } from './debug';

class Controllers {
  constructor(
    private readonly services: Services,
    private readonly api: Api,
    private readonly rootStore: RootController,
  ) {
    this.main = new Main(services, api);
    this.addPlace = new AddPlace(services, api);
    this.findPlace = new FindPlace(services, api);
    this.debug = new Debug(services, api);
  }

  readonly main: Main;
  readonly addPlace: AddPlace;
  readonly findPlace: FindPlace;
  readonly debug: Debug;
}

export { Controllers };
