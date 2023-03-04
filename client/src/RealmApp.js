import { createContext, useContext, useState, useEffect } from 'react';
import * as Realm from 'realm-web';

const RealmContext = createContext(null);

export function RealmAppProvider({ appId, children }) {
  const [realmApp, setRealmApp] = useState(null);
  const [appDB, setAppDB] = useState(null);
  const [realmUser, setRealmUser] = useState(null);

  useEffect(() => {
    Realm.BSON.ObjectId();
    setRealmApp(Realm.getApp(appId));
  }, [appId]);

  useEffect(() => {
    const init = async () => {
      if (!realmApp.currentUser) {
        await realmApp.logIn(Realm.Credentials.anonymous());
      }

      setRealmUser(realmApp.currentUser);
      setAppDB(
        realmApp.currentUser
          .mongoClient(process.env.REACT_APP_MONGO_SVC_NAME)
          .db(process.env.REACT_APP_MONGO_DB_NAME)
      );
    };

    if (realmApp) {
      init();
    }
  }, [realmApp]);

  return (
    <RealmContext.Provider value={{ realmUser, appDB }}>
      {children}
    </RealmContext.Provider>
  );
}

export function useRealmApp() {
  const app = useContext(RealmContext);
  if (!app) {
    throw new Error(
      `No Realm App found. Did you call useRealmApp() inside of a <RealmAppProvider />.`
    );
  }

  return app;
}
