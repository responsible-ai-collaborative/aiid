import * as Realm from 'realm-web';
import config from '../../config';

const REALM_APP_ID = config.realm.review_db.realm_app_id;

export const realmApp = new Realm.App({
  id: REALM_APP_ID,
});
