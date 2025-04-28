import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    device: '/device'
};

function getDevices(callback) {
    let request = new Request(HOST.device_api + endpoint.device, {
        method: 'GET',
    });
    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(deviceId, callback){
    let request = new Request(HOST.device_api + endpoint.device + "/" + deviceId, {
        method: 'GET'
    });

    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback){
    let request = new Request(HOST.device_api + endpoint.device , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function editDevice(device, callback){
    let request = new Request(HOST.device_api + endpoint.device + "/" + device.deviceId , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteDevice(deviceId, callback){
    let request = new Request(HOST.device_api + endpoint.device + "/" + deviceId, {
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
    getDevices,
    getDeviceById,
    postDevice,
    deleteDevice,
    editDevice
};