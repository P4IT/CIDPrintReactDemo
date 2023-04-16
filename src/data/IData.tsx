import { Device, EventType, PrinterLibraryActionType, PrinterLibraryEvent } from "@captureid/capacitor3-cidprint";
import { createContext, useContext } from "react";

export interface IMessage {
  message: string;
  detail: string;
}

export class Message implements IMessage {
  message: string = '';
  detail: string = '';
}

export interface IData {
    printers: null | undefined | any;
    messages: null | undefined | any;
    setPrinter: (printer: Device) => void;
    addMessage: (event: PrinterLibraryEvent) => void;
}

export const CIDContext = createContext<IData | undefined>(undefined);

export const DataProvider: React.FC = ({ children }) => {
    const printers: Device[] = [];
    const messages: Message[] = [];

    const getKey = (obj: any, value: any) => {
      const keyIndex = Object.values(obj).indexOf(value)  
      return Object.keys(obj)[keyIndex]
    }
  
    const setPrinter = (item: Device) => {
      printers.pop();
      printers.push(item);
    };

    const addMessage = (event: PrinterLibraryEvent) => {
      let msg: Message = new Message();
      msg.message = getKey(PrinterLibraryActionType, event.action) + '-' + getKey(EventType, event.type) + '\r\n';
      msg.detail = JSON.stringify(event);
      messages.push(msg);
    };

    let state = {
        printers: printers,
        setPrinter,
        messages: messages,
        addMessage,
    };
  
  return <CIDContext.Provider value={state}>{children}</CIDContext.Provider>;
  };
  
  export default CIDContext;
  export const useDataProvider = () => useContext<IData | undefined>(CIDContext)!;
