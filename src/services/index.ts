import { HttpActions } from 'services/httpActions';
import { Download } from 'services/download';
import { Aws } from 'services/aws';
import { MapsApi } from 'services/mapsApi';
import type { RootController } from 'core/rootController';

class Services {
  constructor(public rootController: RootController) {
    this.httpActions = new HttpActions();
    this.download = new Download();
    this.aws = new Aws();
    this.mapsApi = new MapsApi();
  }

  readonly httpActions: HttpActions;
  readonly download: Download;
  readonly aws: Aws;
  readonly mapsApi: MapsApi;
}

export { Services };
