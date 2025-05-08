import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    people: '/people'
};

function getPersons(callback) {
    let request = new Request(HOST.people_api + endpoint.people, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPersonById(personId, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/" + personId, {
        method: 'GET'
    });

    console.log(request.url);
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

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function editPerson(user, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/" + user.personId , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deletePerson(personId, callback){
    let request = new Request(HOST.people_api + endpoint.people + "/" + personId, {
        method: 'DELETE',
        headers : {
            'Accept': '*/*',
            'Content-Type': 'text/plain',
        },
    });

    console.log("URL: " + request.url);

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

    console.log("URL: " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getPersons,
    getPersonById,
    postPerson,
    deletePerson,
    authenticateUser,
    editPerson
};