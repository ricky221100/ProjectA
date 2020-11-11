import { environment as defaultEnvironment } from './environment.base';

export const environment = {
  ...defaultEnvironment,
  production: true,
  webServiceUri: '/api/v1/',
  socketIoConfig: {url: '/', options: {}},
  envName: 'dev'
};
