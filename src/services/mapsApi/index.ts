import { MAPS_API_KEY } from 'shared/helpers/env';

interface Config {
  latitude: number;
  longitude: number;
  sizes?: [number, number];
  markerLink?: string;
  zoom?: number;
}

const DEFAULT_CONFIG = {
  sizes: [1024, 1024],
  markerLink: 'https://www.google.com/mapfiles/arrow.png',
  zoom: 19,
};

const API_URL = 'https://maps.googleapis.com/maps/api/staticmap';

class MapsApi {
  constructor(private readonly apiUrl: string = API_URL) {
    this.apiUrl = apiUrl;
  }

  public getPlaceUrl(config: Config) {
    const params = { ...DEFAULT_CONFIG, ...config };
    const size = params.sizes.join('x');

    return `${this.apiUrl}?size=${size}&markers=icon:${params.markerLink}|${params.latitude},${params.longitude}&zoom=${params.zoom}&key=${MAPS_API_KEY}`;
  }
}

export { MapsApi };
