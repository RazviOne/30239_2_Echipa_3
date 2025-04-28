import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    messageSend: '/messageSend'
};

function postMessageSend(messageSend, callback){
    let request = new Request(HOST.chat_api + endpoint.messageSend , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageSend)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    postMessageSend
};