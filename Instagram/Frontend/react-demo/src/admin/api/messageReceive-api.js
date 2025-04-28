import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    messageReceive: '/messageReceive'
};

function postMessageReceive(messageReceive, callback){
    let request = new Request(HOST.chat_api + endpoint.messageReceive , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageReceive)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    postMessageReceive
};