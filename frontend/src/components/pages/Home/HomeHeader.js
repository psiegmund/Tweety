import styled from "styled-components";
import ProfilePic from "../../shared/ProfilePic";
import BirdLogoUrl from "../../../img/icons/Bird Logo.svg";
import {Link} from "react-router-dom";

const HomeHeader = ({userProfilePicture, nouserpic}) => {

    return (
        <HeaderWrapper>
            <IconBar>
                {!nouserpic && (
                    <ProfilePic size={"small"} src={userProfilePicture}/>
                )}
                <BirdLink to={"/home"}>
                    <BirdLogo src={BirdLogoUrl} alt="Bird Logo"/>
                </BirdLink>
            </IconBar>
        </HeaderWrapper>
    );
};

const HeaderWrapper = styled.header`
  position: sticky;
  max-width: var(--max-width);
  top: 0;
  background-color: #fff;
  padding: 2rem var(--spacing-wrapper) 0.5rem var(--spacing-wrapper);
  border-bottom: 1px solid var(--clr-line-grey);
`;

const IconBar = styled.div`
	display: flex;
	align-items: center;
`;

const BirdLink = styled(Link)`
	flex: 1;
	justify-self: center;
	padding-right: 32px;
`;

const BirdLogo = styled.img`
  margin: 0 auto;
  width: 27px;
  height: 27px;
`;

export default HomeHeader;