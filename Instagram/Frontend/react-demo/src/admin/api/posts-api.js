import {HOST} from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";


const endpoint = {
    posts: '/posts'
};

function getPosts(callback) {
    let request = new Request(HOST.posts_api + endpoint.posts, {
        method: 'GET',
    });
    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getPostById(idPost, callback){
    let request = new Request(HOST.posts_api + endpoint.posts + "/" + idPost, {
        method: 'GET'
    });

    // console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postPost(post, callback){
    let request = new Request(HOST.posts_api + endpoint.posts , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function editPost(post, callback){
    let request = new Request(HOST.posts_api + endpoint.posts + "/" + post.idPost , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post)
    });

    // console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

function deletePost(idPost, callback){
    let request = new Request(HOST.posts_api + endpoint.posts + "/" + idPost, {
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

export {
    getPosts,
    getPostById,
    postPost,
    deletePost,
    editPost
};