import { Controllers } from 'controllers';
import { Services } from 'services';
import { Api } from 'core/api';

class RootController {
  constructor() {
    this.services = new Services(this);
    this.api = new Api(this.services);
    this.controllers = new Controllers(this.services, this.api, this);
  }

  services: Services;
  api: Api;
  controllers: Controllers;
}

export { RootController };
