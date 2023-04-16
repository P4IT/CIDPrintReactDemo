import { TicketData } from "@captureid/capacitor3-cidprint";

export var MarkdownTicket: TicketData = {
    ...new TicketData(),
    variables: {
        currency: "",
        sellingprice: "",
        last_sellingprice: "",
        original_sellingprice: "",
        additional_description: "",
        unitprice: "",
        filling: "",
        season: "",
        class: "",
        code: "",
        supplier: "",
        serial: "",
        company_identifier: "",
        line_identifier: "",
        item_number: "",
        colour_position: "",
        barcode: "",
        computer_size: "",
        sequence: ""
    }
};

export const MarkdownLabel = (): TicketData => {
    let mdticket = MarkdownTicket;

    mdticket.variables.customersize = "6y 122-148";
    mdticket.variables.euro_last_swidth = "5";
    mdticket.variables.euro_original_swidth = "5";
    mdticket.variables.euro_currency = "EUR";
    mdticket.variables.euro_sellingprice = "12,99";
    mdticket.variables.euro_last_sellingprice = "15,99";
    mdticket.variables.euro_original_sellingprice = "19,99";
    mdticket.variables.euro_last_crosschar = "X";
    mdticket.variables.euro_original_crosschar = "X";
    mdticket.variables.national_last_swidth = "5";
    mdticket.variables.national_original_swidth = "5";
    mdticket.variables.national_currency = "KN";
    mdticket.variables.national_sellingprice = "35,00";
    mdticket.variables.national_last_sellingprice = "52,00";
    mdticket.variables.national_original_sellingprice = "80,00";
    mdticket.variables.national_last_crosschar = "X";
    mdticket.variables.national_original_crosschar = "X";
    mdticket.variables.last_swidth = "5";
    mdticket.variables.original_swidth = "5";
    mdticket.variables.currency = "EUR";
    mdticket.variables.sellingprice = "12,99";
    mdticket.variables.last_sellingprice = "15,99";
    mdticket.variables.original_sellingprice = "19,99";
    mdticket.variables.last_crosschar = "X";
    mdticket.variables.original_crosschar = "X";
    mdticket.variables.additional_description = "";
    // mdticket.variables.additional_description = "Egysegar";
    mdticket.variables.unitprice = "4,00";
    mdticket.variables.filling = "**";
    mdticket.variables.season = "WW";
    mdticket.variables.class = "261";
    mdticket.variables.code = "63";
    mdticket.variables.supplier = "30109";
    mdticket.variables.serial = "806";
    mdticket.variables.company_identifier = "DE";
    mdticket.variables.line_identifier = "A";
    mdticket.variables.item_number = "1234.565";
    mdticket.variables.colour_position = "1";
    mdticket.variables.order = "1 111/11 22 1223 12321 2";
    mdticket.variables.barcode = "12345678901234";
    mdticket.variables.gtin = "123456789012345678901";
    mdticket.variables.information = "2 1234.565 111 1111 3";
    mdticket.variables.computer_size = "000";
    mdticket.variables.sequence = "01";
    mdticket.variables.rfidlogo = "rfid.bmp";
    mdticket.variables.greendotlogo = "greendot.bmp";
    mdticket.variables.candalogo = "canda.bmp";
    mdticket.variables.hand = "hand.bmp";
    mdticket.variables.qrcode = 'https://qr.c-a.com/?01=04062849672653';
    mdticket.variables.candalink = "www.c-a.com";
    return mdticket;
}