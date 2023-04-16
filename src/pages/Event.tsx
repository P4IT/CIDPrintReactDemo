import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader } from '@ionic/react';
import './Event.css';
import { Message, useDataProvider } from '../data/IData';

const Event: React.FC = () => {
  const { messages } = useDataProvider();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Event Log</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {messages.map((item: Message, index: any) => (
              <IonItem key={index}>
                <IonCard>
                  <IonCardHeader>
                  <IonLabel>{item.message}</IonLabel>
                  </IonCardHeader>
                  <IonCardContent>{item.detail}</IonCardContent>
                </IonCard>
              </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Event;
