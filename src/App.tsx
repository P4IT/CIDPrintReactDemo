import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { print, square, bluetooth } from 'ionicons/icons';
import Tab1 from './pages/Connect';
import Tab2 from './pages/Print';
import Tab3 from './pages/Event';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { DataProvider } from './data/IData';

//setupConfig();


const App: React.FC = () => {

  return (
    <IonApp>
      <DataProvider>
      <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/connect">
            <Tab1 />
          </Route>
          <Route exact path="/print">
            <Tab2 />
          </Route>
          <Route path="/event">
            <Tab3 />
          </Route>
          <Route exact path="/">
            <Redirect to="/connect" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="connect" href="/connect">
            <IonIcon aria-hidden="true" icon={bluetooth} />
            <IonLabel>Discover</IonLabel>
          </IonTabButton>
          <IonTabButton tab="print" href="/print">
            <IonIcon aria-hidden="true" icon={print} />
            <IonLabel>Print</IonLabel>
          </IonTabButton>
          <IonTabButton tab="event" href="/event">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Events</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      </IonReactRouter>
      </DataProvider>
      </IonApp>
  );
}

export default App;
