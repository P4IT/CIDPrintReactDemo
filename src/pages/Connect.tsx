import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToggle, IonToolbar, useIonLoading, useIonRouter, useIonToast, useIonViewDidEnter } from '@ionic/react';
import './Connect.css';
import { CIDPrint, CIDPrinterListenerTypes, Device, EventType, InitResult, LicenseResult, LicenseStatus, PrinterLibraryActionType, PrinterLibraryEvent } from '@captureid/capacitor3-cidprint';
import { barcodeOutline, chevronUpCircleOutline, searchOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { BluetoothResult } from '@captureid/capacitor3-cidprint';
import { useDataProvider } from '../data/IData';

const licenseKey = "A92BF2DF001BF8976894103E9F0963145B22360B2992BA41B16B66219389E695F05C9604028EB29610EFED2D68A9ABACB838BE002804F37EC2DDA7EBCFA70E45A2A4C58D5C435156EF38A3A60454EE08105BB34D7704DD44E01B30909CC63677C3FBC93FB85796D6D22F1C769BD71A763F2201A4AC8DCA5363A21573EE7532D77DE71EEF5F473594D58DC4C8FEAD191F41B7429D0B95CC1B8DBC548A8235DD6DE3279D716756F7492B24870AD8E5F9364DF2CF6DD96436DAA642A25AF7B9569383126F8E3CDF02EAF46780D38FCA9967569BBC49CE7EC582E2A2DD6EB3646DEC18233D18C75F85D1B75BF5BA778F65F2708F46CA74E70598C65312BE39614C3544029EE45A900718C37F6A8326DA7DE4C5FD9947C6E273E101373E3DA545FEFE5DF4F07C3BDB5848545F00489575F6D687879CE666B331C02D52BBAE5DAA9631FB6B2BF5350FF143CE8DD25E005318AA92B3EE03D25EE4EF0F54E64EE8187B495834FF69E98864E89C2F9FF5198D30ADBAD38884458AD22329D625B61ABE5A239B7A86055E2E6BD3BCA0F1916022AB00B54F9CBC337145C3A8AA79A8BDDADCCC8DC8B66BA2BFE6F6C5A27B10ECA596BF3CD12DA14AEF9F97D4DAD811ACCEE9D01BC384785CB5E2DA2658E8976C6792F3ED891701FB762AA9648437650C97D950C72E63F0F4A8F1E8250F674A10AF1C060666DC446F81FA8080B2D034095C50E9A6AD2A606430B453D6F526F24FC314085017E3B911890400A61ABFF6AC681D846A775C872755F73231CA4CF2C8878754AA1E959908AB5B0547AA9568B968382A908594E35AEF91C5513E1F987DA2187DCD6FC401C4FE7631A652A7BCD6FACD17B5C8F4FA27A37AA6F834470A94767AC4E85D82C48969671579BE594167FFD675F335093B1A58224C3D6124524B3D0648E9BE67C4B01B99E31FAEC8CC4D6CBDA4222CBB5B084EC94286EA91C435C67AEB";
const customerID = "005011";

const Connect: React.FC = () => {
  const [toast] = useIonToast();
  const [loader, hideLoader] = useIonLoading();
  const [useDebug, setUseDebug] = useState(false);
  const { setPrinter, addMessage } = useDataProvider();
  const [discoveredPrinters, setDiscoveredPrinters] = useState<Device[]>([]);
  const router = useIonRouter();

  useEffect(() => {
      CIDPrint.enableDebugToFile({enable: useDebug});
  }, [useDebug])

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
          <IonItem>
            <IonLabel>{useDebug?'debug':'no debug'}</IonLabel>
            <IonToggle checked={useDebug} onIonChange={(e) => setUseDebug(e.detail.checked)} />
          </IonItem>

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
