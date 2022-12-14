import {
    Content,
    TweetHeader,
    Headline,
    Info,
    Stats,
    StatsWrapper,
    Time,
    UserInfo,
    UserPic,
    Wrapper, Header
} from './TweetDetails.styling';
import Moment from "react-moment";
import {useLocation, useNavigate, useParams, useResolvedPath} from "react-router-dom";
import Tweet from "../../shared/Tweet/Tweet";
import userPlaceHolderImage from '../../../img/profileplaceholder.png';
import TweetStats from "../../shared/Tweet/TweetStats";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiLink} from "../../utils/apiLink";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {handleModal, loggedInUser, modalId, tweetStateFamily} from "../../utils/SharedStates";
import LoadingPage from "../../shared/LoadingPage/LoadingPage";
import BackButton from "../../shared/BackButton";
import {TweetWrapper} from "../../../styles/TweetWrapper";

const TweetDetails = () => {
    const {id} = useParams();
    const userData = useRecoilValue(loggedInUser);
    const [isLoading, setIsLoading] = useState(true);
    const [tweetData, setTweetData] = useRecoilState(tweetStateFamily(id));
    const setShowModal = useSetRecoilState(handleModal);
    const setIdModal = useSetRecoilState(modalId);
    const [replies, setReplies] = useState([]);
    const navigator = useNavigate()
    const {state: prevPath} = useLocation();

    const axiosOptions = {
        headers: {
            token: 'JWT ' + userData?.accessToken
        }
    }

    useEffect(() => {
        const getTweetDetails = async () => {
            const response = await axios.get(apiLink + `/tweets/details/${id}`, axiosOptions);
            setTweetData({
                ...response.data.tweetDetails[0],
                liked: response.data.tweetDetails[0].likes.includes(userData?.userId)
            });
            setReplies(response.data.repliesById.result);
            setIsLoading(false);
        }
        getTweetDetails();
    }, [id,userData]);

    const toProfile = (id) => {
        navigator(`/profile/${id}`)
    }

    const showImageModal = () => {
        setShowModal(true);
        setIdModal({tweetId: id})
    }

    const pathHistory = () => {
        if(prevPath?.location === 'replytweet') {
            return -3;
        }
        return -1;
    }

    if (isLoading) {
        return <LoadingPage/>
    } else {
        return (
            <>
                <BackButton path={pathHistory()}/>
                <Header>
                    <Headline>Tweet</Headline>
                </Header>
                <Wrapper>
                    <TweetHeader onClick={() => toProfile(tweetData.postedBy._id)}>
                        <UserPic src={tweetData.postedBy.profilePictureLink || userPlaceHolderImage} alt="Profile Pic"/>
                        <UserInfo>
                            <p>{tweetData.postedBy.firstName} {tweetData.postedBy.lastName}</p>
                            <span>@{tweetData.postedBy.username}</span>
                        </UserInfo>
                    </TweetHeader>
                    <Content>
                        <p>{tweetData.content}</p>
                        {tweetData.imgLink && <img src={tweetData.imgLink} alt={'embedded in Tweet'} onClick={() => showImageModal()}/>}
                    </Content>
                    <Info>
                        <Time><Moment format={`HH:MM - DD/MM/YY`}>{new Date(tweetData.postedAt)}</Moment></Time>
                        <span>&#183;</span>
                        <p>Tweety Web App</p>
                    </Info>
                    <StatsWrapper>
                        <Stats>
                            <p>{tweetData.retweets?.length}</p>
                            <span>Retweets</span>
                        </Stats>
                        <Stats>
                            <p>{tweetData.likes?.length}</p>
                            <span>{tweetData.likes?.length === 1 ? 'like' : 'likes'}</span>
                        </Stats>
                    </StatsWrapper>
                    <TweetStats id={id} big/>
                </Wrapper>
                <TweetWrapper>
                    {replies.map((reply) =>
                        <Tweet
                            key={reply._id}
                            {...reply}
                        />
                    )}
                </TweetWrapper>
            </>
        );
    }
};

export default TweetDetails;
