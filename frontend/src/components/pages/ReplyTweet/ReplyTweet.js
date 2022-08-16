import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiLink} from "../../utils/apiLink";
import {
    Cancel,
    Content, DeleteButton, Header,
    Img, ImgPreview, InputButton, PreviewHeader, PreviewHeadline,
    ReplyTo, SpacingContainer,
    Text,
    TextField,
    TweetWrapper,
    UserInfo,
    UserLink,
    UserPic,
    Wrapper
} from "./ReplyTweet.styles";
import PlaceHolderImg from "../../../img/profileplaceholder.jpeg";
import {placeHolderUser} from "../../placeholder";
import Moment from "react-moment";
import {ButtonSmall} from "../../../styles/Buttons";
import {useRecoilValue} from "recoil";
import {loggedInUser} from "../../utils/SharedStates";

const ReplyTweet = () => {
    const userData = useRecoilValue(loggedInUser);
    const navigator = useNavigate();
    const {id: tweetId} = useParams();
    const [tweet, setTweet] = useState({});
    const [fileUpload, setFileUpload] = useState();
    const [content, setContent] = useState('');

    useEffect(() => {
        const getTweet = async () => {
            const response = await axios.get(apiLink + `/tweets/details/${tweetId}`);
            setTweet(response.data.tweetDetails[0]);
        }
        getTweet()
    }, [])

    const toProfile = (id) => {
        navigator(`/profile/${id}`)
    }

    const handleUpload = (e) => {
        e.preventDefault();
        setFileUpload(e.target.files[0]);
    }
    const imgSrc = fileUpload ? URL.createObjectURL(fileUpload) : null;

    const handleDelete = (e) => {
        e.preventDefault();
        setFileUpload(null);
    }

    const onePageBack = () => {
        navigator(-1);
    }

    const replyHandler = async () => {
        const data = {
            replyToId: tweetId,
            content,
            userId: userData._id
        }
        const response = await axios.post(apiLink + '/tweets/newreply', data);
        navigator(`/tweet/${tweetId}`);
    }

    return (<>
            <Header>
                <Cancel onClick={() => onePageBack()}>Cancel</Cancel>
                <ButtonSmall onClick={()=> replyHandler()}>Reply</ButtonSmall>
            </Header>
            <Wrapper>
                <UserPic src={PlaceHolderImg} alt='Profile Pic' onClick={() => toProfile(tweet.postedBy)}/>
                <TweetWrapper>
                    <UserInfo onClick={() => toProfile(tweet.postedBy)}>
                        <p>
                            {placeHolderUser.firstName} {placeHolderUser.lastName}
                        </p>
                        <span>@{placeHolderUser.userName}</span>
                        <span>
						&#183; <Moment fromNow>{tweet.postedAt}</Moment>
					</span>
                    </UserInfo>
                    <Content>
                        <Text>{tweet.content}</Text>
                        {tweet.imgLink && <Img src={tweet.imgLink}/>}
                    </Content>
                    <ReplyTo>Replying to <UserLink to={'/'}>@{[placeHolderUser.userName]}</UserLink> </ReplyTo>
                </TweetWrapper>
            </Wrapper>
            <Wrapper>
                <UserPic src={PlaceHolderImg} alt={'Profile Pic'}/>
                <TextField placeholder={'Tweet your reply'} value={content} onChange={e => setContent(e.target.value)}/>
            </Wrapper>
            <SpacingContainer>
                <InputButton type="file" onChange={handleUpload}/>
            </SpacingContainer>
            <SpacingContainer>
                {fileUpload && <>
                    <PreviewHeader>
                        <PreviewHeadline>Preview</PreviewHeadline>
                        <DeleteButton onClick={handleDelete}>Cancel</DeleteButton>
                    </PreviewHeader>
                    <ImgPreview src={imgSrc} alt=""/>
                </>}
            </SpacingContainer>
        </>
    )
}

export default ReplyTweet;