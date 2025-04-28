import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    person: '/person'
};

function getPersons(callback) {
    let request = new Request(HOST.person_api + endpoint.person, {
        method: 'GET',
    });
    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPersonById(personId, callback){
    let request = new Request(HOST.person_api + endpoint.person + "/" + personId, {
        method: 'GET'
    });

    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPerson(user, callback){
    let request = new Request(HOST.person_api + endpoint.person , {
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
    let request = new Request(HOST.person_api + endpoint.person + "/" + user.userId , {
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

function deletePerson(personId, callback){
    let request = new Request(HOST.person_api + endpoint.person + "/" + personId, {
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

function authenticateUser(username, password, callback){
    let request = new Request(HOST.person_api + endpoint.person + "/authenticate/" + username + "/" + password, {
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
    editPerson
};