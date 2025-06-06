package ro.tuc.ds2020.services;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

public class SMSService {

    public static final String ACCOUNT_SID = "ACe6a2d394389590566e1ec8f149796ec4";
    public static final String AUTH_TOKEN = "5ffcfdd9c121b403df2c995558be4ffd";
    public static final String SMSBody = "Daca te prind prin cartier, te-am ars";

    public SMSService(){}

    public void sendSMS(){
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        Message.creator(
                new PhoneNumber("+40770673736"),
                new PhoneNumber("+19593359719"),
                SMSBody
        ).create();
    }

}
