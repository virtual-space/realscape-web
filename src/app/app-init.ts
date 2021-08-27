import { KeycloakService } from 'keycloak-angular';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  console.log("*** Keycloak Init ***");
  /*
  return (): Promise<any> => keycloak.init({ config: 'assets/keycloak.json',
    bearerExcludedUrls: [{url: '/v1/public', httpMethods: ['GET', 'POST']}]});*/
  return (): Promise<any> => keycloak.init({
    config: 'assets/keycloak.json',
    bearerExcludedUrls: ['/v1/public'],
    initOptions: { checkLoginIframe: false}}).then(res => {
      console.log('initialized');
  });
}
