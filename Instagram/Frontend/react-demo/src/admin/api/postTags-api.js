import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    postTags: '/postTags'
};

function getPostTags(callback) {
    let request = new Request(HOST.posts_api + endpoint.postTags, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPostTagById(idPostTag, callback){
    let request = new Request(HOST.posts_api + endpoint.postTags + "/" + idPostTag, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPostTagByPostId(idPost, callback){
    let request = new Request(HOST.posts_api + endpoint.postTags + "/post/" + idPost, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPostTag(postTag, callback){
    let request = new Request(HOST.posts_api + endpoint.postTags , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postTag)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function editPostTag(postTag, callback){
    let request = new Request(HOST.posts_api + endpoint.postTags + "/" + postTag.idPostTag , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postTag)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deletePostTag(idPostTag, callback){
    let request = new Request(HOST.posts_api + endpoint.postTags + "/" + idPostTag, {
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
    getPostTags,
    getPostTagById,
    getPostTagByPostId,
    postPostTag,
    deletePostTag,
    editPostTag
};