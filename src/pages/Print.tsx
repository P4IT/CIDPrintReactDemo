import { IonButton, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToggle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import './Print.css';
import { useDataProvider } from '../data/IData';
import { BluetoothResult, CIDPrint, CIDPrinterInformation, CIDPrinterListenerTypes, Device, EventType, PrinterLibraryActionType, PrinterLibraryEvent, SatoPrinterModel, TicketData } from '@captureid/capacitor3-cidprint';
import { useEffect, useState } from 'react';
import { chevronDownCircleOutline, lockOpenOutline, lockClosedOutline } from 'ionicons/icons';
import { MarkdownLabel, TransferTicket } from '../data/LabelData';
import { Keyboard } from '@capacitor/keyboard';

const Print: React.FC =  () => {
  const { printers, addMessage } = useDataProvider();
  const [printer, setPrinter] = useState();
  const [connected, setConnected] = useState(false);
  const [useSticker, setUseSticker] = useState(false);
  const [useHand, setUseHand] = useState(false);
  const [useDescriptionSticker, setUseDescriptionSticker] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [ticket, setTicket] = useState<string>();
  const [clipping, setClipping] = useState(false);
  const [info, setInfo] = useState<CIDPrinterInformation>();

  useEffect(() => {
    if(printer !== undefined) {
      CIDPrint.connectToPrinter({address: (printer as unknown as Device).address});
    }
  }, [printer])

  useEffect(() => {
      CIDPrint.enableClipping({enable: clipping});
  }, [clipping]);

  useIonViewDidEnter(() => {
    setPrinter(printers[0]);
    CIDPrint.removeAllListeners();
    CIDPrint.addListener(CIDPrinterListenerTypes.PRINTER_LIBRARY, handleEvents);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
  });

  const handleKeyboardHide = () => {
    CIDPrint.showNavigationBar({show: false});
    console.log('Keybord is hidden');
  }

  const handleMessages = (event: PrinterLibraryEvent) => {
    addMessage(event);
  }

  const handleReceiverEvents = (event: PrinterLibraryEvent) => {
    switch(event.action) {
      case PrinterLibraryActionType.BLUETOOTH_INITIALIZE:
        break;
      case PrinterLibraryActionType.BLUETOOTH_ENABLE:
        break;
      case PrinterLibraryActionType.BLUETOOTH_DISABLE:
        break;
      case PrinterLibraryActionType.CONNECT:
        setConnected(true);
        break;
      case PrinterLibraryActionType.DISCONNECT:
        setConnected(false);
        break;
      case PrinterLibraryActionType.BLUETOOTH_TURNED_OFF:
        break;
      case PrinterLibraryActionType.BLUETOOTH_TURNED_ON:
        break;
      case PrinterLibraryActionType.EXCEPTION:
        break;
    }
  }

  const handleEvents = (event: PrinterLibraryEvent) => {
    handleMessages(event);
    if(event.sender.includes('BluetoothReceiver')) handleReceiverEvents(event);
    switch(event.action) {
      case PrinterLibraryActionType.CONNECT:
        if(event.type === EventType.SUCCESS) {
          setConnected(true);
          let dev: BluetoothResult = event.data as BluetoothResult;
          alert(dev.connecteddevice?.vendor!.toString() + '\n' + SatoPrinterModel.values()[dev.connecteddevice?.model as number]);
        }
        break;
      case PrinterLibraryActionType.DISCONNECT:
        if(event.type === EventType.SUCCESS) {
          setConnected(false);
        }
        break;
      case PrinterLibraryActionType.PRINT:
        if(event.type !== EventType.SUCCESS) {
          alert(event.message);
        }
        break;
      case PrinterLibraryActionType.STATUS:
        break;
      case PrinterLibraryActionType.BLUETOOTH_DISABLE:
        break;
      case PrinterLibraryActionType.BLUETOOTH_ENABLE:
        break;
      case PrinterLibraryActionType.BLUETOOTH_INITIALIZE:
        break;
      case PrinterLibraryActionType.BLUETOOTH_TURNED_OFF:
        break;
      case PrinterLibraryActionType.BLUETOOTH_TURNED_ON:
        break;
      case PrinterLibraryActionType.CONFIGURE:
        break;
      case PrinterLibraryActionType.EXCEPTION:
        break;
    }
  }

  const connect = (value: Device) => {
    const address: string = value.address;
    if(connected) {
      CIDPrint.disconnectFromPrinter({ mac: address });
    } else {
      CIDPrint.connectToPrinter({ address: address, autoreconnect: true });
    }
  }

  const setMediaSize = (value: string) => {
    let str = value.split('x');
    if(str.length === 2) {
      CIDPrint.setupMediaSize({width: +str[0], height: +str[1]});
    }
  }

  const printInput = async () => {
    let data: string = ticket!;
    await CIDPrint.printData({data: data});
  }

  const print = async() => {
    let labelfile: string = useSticker?'price_sticker_hand.dat':'price_ticket_hand.dat';
    let data: TicketData = MarkdownLabel();
    data.variables.hand = useHand?"hand.bmp":"";
//    labelfile = useHand?labelfile + '_hand.dat': labelfile + '.dat';
    await CIDPrint.printLabelWithObject({label: labelfile, data: data});    
  }

  const printnew = async() => {
    let labelfile: string = useDescriptionSticker?'description_sticker':'description_ticket';
    setInfo(await CIDPrint.getPrinterInformation());
    labelfile = info?.modelname.includes("200")?labelfile + '_200.dat': labelfile + '.dat';
    await CIDPrint.printLabelWithObject({label: labelfile, data: MarkdownLabel()});    
  }

  const printzero = async() => {
    await CIDPrint.printLabel({label: 'general_zero.dat'});
  }

  const transport = () => {
    CIDPrint.setupMediaSize({width: 27, height: 96});
    let labelfile = 'non_legacy_transport_label.dat';
    CIDPrint.printLabelWithObject({label: labelfile, data: TransferTicket});
  }

  const legacytransport = () => {
    CIDPrint.setupMediaSize({width: 27, height: 96});
    let labelfile = 'legacy_transport_label.dat';
    CIDPrint.printLabelWithObject({label: labelfile, data: TransferTicket});
  }

  const getstatus = () => {
    CIDPrint.getPrinterStatus();
  }

  const getinfo = () => {
    CIDPrint.getPrinterInformation().then((info: CIDPrinterInformation) => {
      alert(JSON.stringify(info));
      setInfo(info);
    });
  }

  const formfeed = () => {
    CIDPrint.sendFormFeed();
  }

  const calibrate = () => {
    CIDPrint.enableCalibration({enable: true});
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle color={connected === false?'white':'primary'}>Print Examples<br /> {(printer as unknown as Device)?.address}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonFab slot="fixed" vertical="top" horizontal="end" edge={true}>
          <IonFabButton>
            <IonIcon icon={chevronDownCircleOutline}></IonIcon>
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton onClick={() => { connect(printer!)}}>
              <IonIcon icon={connected === false?lockOpenOutline:lockClosedOutline}></IonIcon>
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <IonList>
          <IonItem></IonItem>
          <IonItem>
            <IonLabel>{useSticker?'use Price Sticker':'use Price Ticket'}</IonLabel>
            <IonToggle checked={useSticker} onIonChange={(e) => setUseSticker(e.detail.checked)} />
          </IonItem>
          <IonItem>
            <IonLabel>{useHand?'no Hand Icon':'use Hand Icon'}</IonLabel>
            <IonToggle checked={useHand} onIonChange={(e) => setUseHand(e.detail.checked)} />
          </IonItem>
          <IonItem>
            <IonLabel>{useDescriptionSticker?'use Description Sticker':'use Description Ticket'}</IonLabel>
            <IonToggle checked={useDescriptionSticker} onIonChange={(e) => setUseDescriptionSticker(e.detail.checked)} />
          </IonItem>
          <IonItem>
            <IonLabel></IonLabel>
            <IonButton shape='round' fill='outline'onClick={() => print()}>
              {useSticker?'print Price Sticker':'print Price Ticket'}
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel></IonLabel>
            <IonButton shape='round' fill='outline'onClick={() => printnew()}>
              {useDescriptionSticker?'print Description Sticker':'print Description Ticket'}
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel></IonLabel>
            <IonButton shape='round' fill='outline'onClick={() => printzero()}>Markdown to Zero</IonButton>
          </IonItem>
          <IonItem>
            <IonLabel>Media Size</IonLabel>
            <IonSelect interface="popover" onIonChange={(e) => setMediaSize(e.detail.value)}>
              <IonSelectOption value="46x37">46 x 37</IonSelectOption>
              <IonSelectOption value="46x88">46 x 88</IonSelectOption>
              <IonSelectOption value="27x96">27 x 96</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Ticket Editor</IonLabel>
            <IonButton shape='round' fill='outline'onClick={() => setShowEdit(true)}>Start</IonButton>
          </IonItem>
          <IonItem>
            <IonButton shape='round' fill='outline'onClick={() => formfeed()}>Form Feed</IonButton>
            <IonButton shape='round' fill='outline'onClick={() => calibrate()}>Calibrate</IonButton>
            <IonButton shape='round' fill='outline'onClick={() => setClipping(!clipping)}>{clipping?'disable ':'enable '} Clipping</IonButton>
          </IonItem>
          <IonItem>
            <IonButton shape='round' fill='outline'onClick={() => transport()}>Transport Ticket</IonButton>
            <IonButton shape='round' fill='outline'onClick={() => legacytransport()}>Legacy Transport Label</IonButton>
          </IonItem>
          <IonItem>
            <IonButton shape='round' fill='outline'onClick={() => getstatus()}>get Status</IonButton>
            <IonButton shape='round' fill='outline'onClick={() => getinfo()}>get Information</IonButton>
          </IonItem>
          <IonItem>
            <IonButton shape='round' fill='outline'onClick={async () => await CIDPrint.enableBluetoothAdapter({enable: true})}>enable/disable Bluetooth</IonButton>
          </IonItem>
        </IonList>
        <IonModal isOpen={showEdit}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Ticket Editor</IonTitle>
              <IonButton slot="end" shape='round' fill='outline' onClick={() => setShowEdit(false)}>Close</IonButton>
            </IonToolbar>
          </IonHeader>
          <IonTextarea value={ticket} autoGrow={true} onIonChange={(e) => setTicket(e.detail.value!)}></IonTextarea>
          <IonButton slot="end" shape='round' fill='outline' onClick={() => printInput()}>Print</IonButton>
          <IonList slot='end'><IonItem></IonItem></IonList>
         </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Print;
