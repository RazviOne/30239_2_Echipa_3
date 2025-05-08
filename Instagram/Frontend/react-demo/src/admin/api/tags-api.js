import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    tags: '/tags'
};

function getTags(callback) {
    let request = new Request(HOST.posts_api + endpoint.tags, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getTagById(idTag, callback){
    let request = new Request(HOST.posts_api + endpoint.tags + "/" + idTag, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postTag(tag, callback){
    let request = new Request(HOST.posts_api + endpoint.tags , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function editTag(tag, callback){
    let request = new Request(HOST.posts_api + endpoint.tags + "/" + tag.idTag , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tag)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteTag(idTag, callback){
    let request = new Request(HOST.posts_api + endpoint.tags + "/" + idTag, {
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

export {
    getTags,
    getTagById,
    postTag,
    deleteTag,
    editTag
};