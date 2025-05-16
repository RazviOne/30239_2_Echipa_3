import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import * as API_POSTS from '../admin/api/posts-api';
import * as API_USERS from '../admin/api/people-api';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import LogoImg from '../commons/images/Instagram_login_Logo.png';
import UserImg from '../commons/images/user.png';
import NavigationBar from "../navigation-bar";

function Feed() {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(UserContext);
    const [usernames, setUsernames] = useState({});

    useEffect(() => {
        API_POSTS.getPosts((result, status, error) => {
            if (result !== null && status === 200) {
                setPosts(result);

                result.forEach(post => {
                    const id = post.idPerson;

                    if (!usernames[id]) {
                        API_USERS.getPersonById(id, (userData, userStatus) => {
                            if (userData !== null && userStatus === 200) {
                                setUsernames(prev => ({
                                    ...prev,
                                    [id]: userData.username
                                }));
                            }
                        });
                    }
                });
            } else {
                console.error("Eroare la obținerea postărilor:", error);
            }
        });
    }, []);

    const timeAgo = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffMs = now - postDate;

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return 'chiar acum';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return postDate.toLocaleDateString('ro-RO'); // dacă e mai vechi de o săptămână, afișăm data
    };

    const compareDates = (a, b) => {
        // console.log('Pentru a');
        console.log(a);
        let yearA = parseInt(a.substring(0, 4));
        let monthA = parseInt(a.substring(5, 7));
        let dayA = parseInt(a.substring(8, 10));
        let hourA = parseInt(a.substring(11, 13));
        let minuteA = parseInt(a.substring(14, 16));
        let secondA = parseInt(a.substring(17, 19));
        // console.log(`Year: ${yearA}\nMonth: ${monthA}\nDay: ${dayA}\nHour: ${hourA}\nMinute: ${minuteA}\nSecond: ${secondA}\n`);
        let dateA = new Date();
        dateA.setFullYear(yearA);
        dateA.setMonth(monthA - 1);
        dateA.setDate(dayA);
        dateA.setHours(hourA);
        dateA.setMinutes(minuteA);
        dateA.setSeconds(secondA);
        // console.log(dateA);

        // console.log('Pentru b');
        console.log(b);
        let yearB = parseInt(b.substring(0, 4));
        let monthB = parseInt(b.substring(5, 7));
        let dayB = parseInt(b.substring(8, 10));
        let hourB = parseInt(b.substring(11, 13));
        let minuteB = parseInt(b.substring(14, 16));
        let secondB = parseInt(b.substring(17, 19));
        let dateB = new Date();
        dateB.setFullYear(yearB);
        dateB.setMonth(monthB - 1);
        dateA.setDate(dayB);
        dateB.setHours(hourB);
        dateB.setMinutes(minuteB);
        dateB.setSeconds(secondB);
        // console.log(`Year: ${yearB}\nMonth: ${monthB}\nDay: ${dayB}\nHour: ${hourB}\nMinute: ${minuteB}\nSecond: ${secondB}\n`);
        // console.log(dateB);

        if(dateA >= dateB){
            console.log('A e mai recent decat B');
            return -1;
        }
        else{
            console.log('B e mai recent decat A');
            return 1;
        }
    };

    return (
        <div style={{ padding: '1rem 10%', backgroundColor: '#fafafa' }}>
            <NavigationBar/>
            {/* HEADER */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                borderBottom: '1px solid #ddd',
                paddingBottom: '1rem'
            }}>
                <img src={LogoImg} alt="Instagram Logo" style={{ height: '50px' }} />
                <img
                    src={UserImg}
                    alt="Profil"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
            </div>

            {/* FEED */}
            {posts.length === 0 && <p>Nu există postări momentan.</p>}

            {posts
                .sort((a, b) => compareDates(a.dateCreated, b.dateCreated))
                .map((post, idx) => {
                let imageSource = "";
                if( post.image !== undefined &&
                    post.image !== null) {
                    imageSource = "data:image/png;base64, " + post.image;
                }

                return (
                        <Card key={idx} style={{marginBottom: '2rem', padding: '1rem', maxWidth: '45rem'}}>
                            <CardBody style={{marginLeft: 'auto', marginRight: 'auto'}}>
                                <div style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>
                                    {usernames[post.idPerson] || 'Utilizator necunoscut'} - {timeAgo(post.dateCreated)}
                                </div>

                                {post.image && (
                                    <img
                                        src={imageSource}
                                        alt="Post"
                                        style={{
                                            maxHeight: '40rem',
                                            maxWidth: '40rem',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}
                                    />
                                )}

                                <CardTitle tag="h5" style={{marginBottom: '0.5rem'}}>
                                    {post.title}
                                </CardTitle>
                                <CardText>{post.text}</CardText>
                            </CardBody>
                        </Card>
                    )
                }
            )}
        </div>
    );
}

export default Feed;
