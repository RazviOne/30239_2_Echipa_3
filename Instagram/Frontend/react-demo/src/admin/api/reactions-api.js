import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    reactions: '/reactions'
};

function getReactions (callback) {
    let request = new Request(HOST.reactions_api + endpoint.reactions, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getReactionById(reactionId, callback){
    let request = new Request(HOST.reactions_api + endpoint.reactions + "/" + reactionId, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postReaction(reaction, callback){
    let request = new Request(HOST.reactions_api + endpoint.reactions , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reaction)
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteReaction(reactionId, callback){
    let request = new Request(HOST.reactions_api + endpoint.reactions + "/" + reactionId, {
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
    getReactions,
    getReactionById,
    postReaction,
    deleteReaction,
};