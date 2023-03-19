import { HttpActions } from 'services/httpActions';
import { Download } from 'services/download';
import { MapsApi } from 'services/mapsApi';
// import { Aws } from 'services/aws';
import type { RootController } from 'core/rootController';

class Services {
  constructor(public rootController: RootController) {
    this.httpActions = new HttpActions();
    this.download = new Download();
    this.mapsApi = new MapsApi();
    // this.aws = new Aws();
  }

  readonly httpActions: HttpActions;
  readonly download: Download;
  readonly mapsApi: MapsApi;
  // readonly aws: Aws;
}

export { Services };
