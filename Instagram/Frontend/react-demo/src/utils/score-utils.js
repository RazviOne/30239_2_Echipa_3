export function calculateUserScores(posts, reactions) {
    const scores = {};

    // Inițializare scoruri
    posts.forEach(post => {
        if (!scores[post.idPerson]) {
            scores[post.idPerson] = 0;
        }
    });

    reactions.forEach(reaction => {
        const { idPost, idPerson, isLiked } = reaction;

        const reactedPost = posts.find(p => p.idPost === idPost);
        if (!reactedPost) return;

        const isComment = reactedPost.idParent !== null;
        const authorId = reactedPost.idPerson;

        // Inițializare autor și reacționator
        if (!scores[authorId]) scores[authorId] = 0;
        if (!scores[idPerson]) scores[idPerson] = 0;

        if (isLiked) {
            scores[authorId] += isComment ? 5 : 2.5;
        } else {
            scores[authorId] -= isComment ? 2.5 : 1.5;
            if (idPerson !== authorId && isComment) {
                scores[idPerson] -= 1.5;
            }
        }
    });

    return scores;
}
