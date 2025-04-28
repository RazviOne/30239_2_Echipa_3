import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    deviceLink: '/deviceLink'
};

function getDeviceLinks(callback) {
    let request = new Request(HOST.device_api + endpoint.deviceLink, {
        method: 'GET',
    });
    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDeviceLinkById(deviceId, callback){
    let request = new Request(HOST.device_api + endpoint.deviceLink + "/" + deviceId, {
        method: 'GET'
    });

    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postDeviceLink(deviceLink, callback){
    let request = new Request(HOST.device_api + endpoint.deviceLink , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceLink)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteDeviceLink(deviceId, callback){
    let request = new Request(HOST.device_api + endpoint.deviceLink + "/" + deviceId, {
        method: 'DELETE',
        headers : {
            'Accept': '*/*',
            'Content-Type': 'text/plain',
        },
    });

    // console.log("URL: " + request.url);

    try {
        RestApiClient.performRequest(request, callback);
    } catch (error){
        // console.log(`In API: ${error}`);
    }
}

export {
    getDeviceLinks,
    getDeviceLinkById,
    postDeviceLink,
    deleteDeviceLink,
};