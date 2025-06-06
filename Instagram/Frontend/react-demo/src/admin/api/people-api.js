import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    people: '/people'
};

function getPersons(callback) {
    let request = new Request(HOST.people_api + endpoint.people, {
        method: 'GET',
    });
    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPersonById(idPerson, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/" + idPerson, {
        method: 'GET'
    });

    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPerson(user, callback){
    let request = new Request(HOST.people_api + endpoint.people , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function editPerson(user, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/" + user.idPerson , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deletePerson(idPerson, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/" + idPerson, {
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
        console.log(`In API: ${error}`);
    }
}

function authenticateUser(username, password, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/authenticate/" + username + "/" + password, {
        method: 'GET',
    });

    // console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

function banPerson(idPerson, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/ban/" + idPerson, {
        method: 'GET',
    });

    // console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getPersons,
    getPersonById,
    postPerson,
    deletePerson,
    authenticateUser,
    editPerson,
    banPerson
};