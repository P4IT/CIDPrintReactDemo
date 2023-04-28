import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonLoading, useIonRouter, useIonToast, useIonViewDidEnter } from '@ionic/react';
import './Connect.css';
import { CIDPrint, CIDPrinterListenerTypes, Device, EventType, InitResult, LicenseResult, LicenseStatus, PrinterLibraryActionType, PrinterLibraryEvent } from '@captureid/capacitor3-cidprint';
import { barcodeOutline, chevronUpCircleOutline, searchOutline } from 'ionicons/icons';
import { useState } from 'react';
import { BluetoothResult } from '@captureid/capacitor3-cidprint';
import { useDataProvider } from '../data/IData';


const Connect: React.FC = () => {
  const [toast] = useIonToast();
  const [loader, hideLoader] = useIonLoading();
  const { setPrinter, addMessage } = useDataProvider();
  const [discoveredPrinters, setDiscoveredPrinters] = useState<Device[]>([]);
  const router = useIonRouter();

  const handleMessages = (event: PrinterLibraryEvent) => {
    addMessage(event);
  }

  const handleEvents = (event: PrinterLibraryEvent) => {
    handleMessages(event);
    switch(event.action) {
      case PrinterLibraryActionType.DISCOVER_START:
        loader({message: 'discovering printer', spinner: 'circles'});
        break;
      case PrinterLibraryActionType.DISCOVER_FINISH:
        hideLoader();
        setDiscoveredPrinters((event.data as BluetoothResult).discovereddevices!);
        break;
      case PrinterLibraryActionType.DISCOVER_DETECT:
        let data: BluetoothResult = event.data as BluetoothResult;
        showToast(data.discovereddevice?.name + ' - ' + data.discovereddevice?.address + ' discovered');
        break;
    }
//    alert(JSON.stringify(event));
  }

  const showToast = (message: string) => {
    toast({ message: message, duration: 2000 });
  }

  const discover = () => {
    CIDPrint.discoverDevices({timeout: 0});
  }

  const connect = (item: any) => {
    setPrinter(item);
    router.push('/print');
  }

  useIonViewDidEnter(() => {
    initialize();
  })

  const initialize = async () => {
      CIDPrint.removeAllListeners();
      CIDPrint.addListener(CIDPrinterListenerTypes.PRINTER_LIBRARY, handleEvents);
      if(!(await CIDPrint.isLibraryInitialized()).result) {
        await CIDPrint.initCIDPrinterLib().then(async (event : PrinterLibraryEvent) => {
        handleEvents(event);
        let perms: {result: boolean} = {result: true};
        if(event.type === EventType.NOTIFY && event.data != null) {
          let data: InitResult = event.data as InitResult;
          if(data.permissions !== undefined && data.permissions.length > 0) {
            await CIDPrint.requestAllPermissions({permissions: data.permissions}).then((value: {result: boolean}) => {
              perms = value;
            },(reason: any) => {
              if(reason.message.endsWith('android.permission.BLUETOOTH_CONNECT')) {
                perms.result = true;
              }
            });
          }
        }
        if(perms.result === true) {
          await CIDPrint.activateLicense({licenseKey, customerID}).then(async (event: PrinterLibraryEvent) => {
            handleMessages(event);
            // license event can be captured here or in the registered eventlistener
            if(event.action === PrinterLibraryActionType.LICENSE_ACTIVATION) {
              let data: LicenseResult = event.data as LicenseResult;
                showToast( LicenseStatus[data.status] );
                await CIDPrint.enableBluetoothPrinting({enable: true});
            }
          });
        }
      });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Discover Printer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {discoveredPrinters.map((item: Device, index: any) => (
            <IonItem key={index} onClick={() => {connect(item)}}>
              <IonLabel>{item.name}</IonLabel>
              <IonLabel>{item.address}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={chevronUpCircleOutline}></IonIcon>
          </IonFabButton>
          <IonFabList side="top">
            <IonFabButton>
              <IonIcon icon={barcodeOutline}></IonIcon>
            </IonFabButton>
            <IonFabButton onClick={() => discover()}>
              <IonIcon icon={searchOutline}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Connect;
