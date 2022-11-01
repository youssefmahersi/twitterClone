import React, { useState, useEffect, useContext, useRef } from "react";
import style from "./style.module.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { AuthContext, useAuth } from "../../contextes/AuthContext";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Tweet from "../Tweet/Tweet";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Avatar } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { CircularProgress as Spinner } from "@mui/material";
export async function followUserHandler(token, id) {
  const data = { followingId: id };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };
  let response = await axios.post(
    `${process.env.REACT_APP_SERVER_URL}feed/follow-user`,
    data,
    config
  );
  return response;
}
export async function getUser(token, uid) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };
  let response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}feed/${uid}`,
    config
  );
  return response;
}

export function MiniProfile({
  isFollowed,
  name,
  bio,
  profilePicture,
  count,
  id,
  followUserHandler,
  profileBackground,
}) {
  const Auth = useContext(AuthContext);
  const [followed, setFollowed] = useState(isFollowed);
  const [isLoading, setIsloading] = useState(false);
  return (
    <div className={style.miniProfileContainer}>
      <div className={style.miniProfileContent}>
        <Avatar
          variant="rounded"
          src={`${process.env.REACT_APP_SERVER_URL}${profilePicture}`}
        ></Avatar>
        <div className={style.miniProfileHeader}>
          <h4 className={style.miniProfileName}>
            <Link to={`/profile/${id}`}>{name}</Link>
          </h4>
          <div className={style.miniProfileCount}>{count}</div>
        </div>
        {Auth?.user?.userId !== id ? (
          !followed ? (
            <button
              disabled={isLoading}
              type="button"
              style={{ justifySelf: "end" }}
              onClick={() => {
                setIsloading(true);
                followUserHandler()
                  .then(() => {
                    setFollowed(!followed);
                  })
                  .finally(() => {
                    setIsloading(false);
                  });
              }}
              className={`pr ${style.followButton2}`}
            >
              <ControlPointIcon sx={{ width: 14, height: 14 }} />
              Follow
            </button>
          ) : (
            <button
              disabled={isLoading}
              type="button"
              onClick={() => {
                setIsloading(true);
                followUserHandler()
                  .then(() => {
                    setFollowed(!followed);
                  })
                  .finally(() => {
                    setIsloading(false);
                  });
              }}
              className={`pr ${style.followButton2}`}
              style={{ background: "#bdbdbd" }}
            >
              <HighlightOffIcon sx={{ width: 14, height: 14 }} />
              Following
            </button>
          )
        ) : null}
      </div>
      <div className={style.miniProfileBio}>{bio}</div>

      <img
        className={style.miniProfileBackground}
        src={
          profileBackground
            ? `${process.env.REACT_APP_SERVER_URL}${profileBackground}`
            : `${process.env.PUBLIC_URL}/img/default pc.jpg`
        }
        alt="Profile background"
      />
    </div>
  );
}

function UsersModal({ header, usersList, show, off }) {
  const Auth = useContext(AuthContext);
  const [followersId, setFollowersId] = useState([]);

  const usersMiniProfiles = usersList.map((user) => {
    let isFollowed = followersId.includes(user.userId);
    return (
      <MiniProfile
        isFollowed={isFollowed}
        key={user._id}
        name={user.username}
        id={user.userId}
        followUserHandler={() =>
          followUserHandler(Auth?.user?.token, user?.userId)
        }
        bio={user.userBio}
        profileBackground={user.pc}
        profilePicture={user.pp}
        count={`${user.userFolllowers.length} followers`}
      />
    );
  });
  useEffect(() => {
    getUser(Auth?.user?.token, Auth?.user?.userId).then((res) => {
      setFollowersId(
        res.data.user.following.map((follower) => follower.userId)
      );
    });
    // eslint-disable-next-line
  }, []);
  return (
    <div className={style.usersModal} style={{ display: !show && "none" }}>
      <div
        onClick={() => {
          off(false);
        }}
        className={style.dummyBackground}
      />
      <div className={style.usersModalContainer}>
        <div className={style.userModalHeader}>
          <h4>{header}</h4>
          <ClearIcon
            style={{ cursor: "pointer" }}
            onClick={() => {
              off(false);
            }}
          />
        </div>
        <div className={style.usersList}>{usersMiniProfiles}</div>
      </div>
    </div>
  );
}

async function getUserTweets(uid, token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };
  let res = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}feed/tweets/${uid}`, config)
    .then((res) => {
      return res;
    });
  return res;
}

export default function Profile(props) {
  const Auth = useAuth();
  const paramId = useParams().id;
  const id = paramId ? paramId : Auth?.userId;
  const [photoCover, setPhotoCover] = useState("");
  const [photoProf, setPhotoProf] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [bio, setBio] = useState("");
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [tweetsList, setTweetsList] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  function parseFollowers() {
    try {
      followers.forEach((user) => {
        if (user.userId === Auth?.userId) {
          setIsFollowed(true);
          throw Error;
        }
      });
    } catch (e) {}
  }

  useEffect(
    () => {
      setIsloading(true);
      setShowFollowing(false);
      setShowFollowers(false);
      getUser(Auth?.token, id).then((res) => {
        const user = res.data.user;
        setPhotoCover(user.photoCover);
        setPhotoProf(user.photoProf);
        setUsername(user.username);
        setBio(user.bio);
        setFollowers(user.followers);
        setFollowing(user.following);

        setUserId(user._id);
      });
      getUserTweets(id, Auth?.token).then((res) => {
        setTweetsList(res?.data?.tweets);
        setIsloading(false);
      });
    },
    // eslint-disable-next-line
    [props.self, paramId]
  );
  // eslint-disable-next-line
  useEffect(parseFollowers, [followers]);

  const tweetsFeed = tweetsList.map((tweet) => (
    <Tweet img={photoProf} auth={Auth} key={tweet._id} tweet={tweet} />
  ));

  async function followUserHandler() {
    const data = { followingId: id };
    const config = {
      headers: {
        Authorization: `Bearer ${Auth?.token}`,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      mode: "no-cors",
    };
    let response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}feed/follow-user`,
      data,
      config
    );
    return response;
  }

  const profileRef = useRef();
  const scrollHeight = profileRef.current?.scrollHeight;
  const [overflowSpacer, setOverflowSpacer] = useState(scrollHeight);
  useEffect(() => {
    setOverflowSpacer(scrollHeight);
    // eslint-disable-next-line
  }, [profileRef.current]);
  return (
    <div className={style.profileContainer}>
      <div ref={profileRef} className={style.profile}>
        <div className={style.backgroundImage}>
          <img
            className={style.bgv2}
            src={
              photoCover
                ? `${process.env.REACT_APP_SERVER_URL}${photoCover}`
                : `${process.env.PUBLIC_URL}/img/default pc.jpg`
            }
            alt="pc"
          />
          <div className={style.profileInfo}>
            <div className={style.profileImage}>
              <img
                src={
                  photoProf
                    ? `${process.env.REACT_APP_SERVER_URL}${photoProf}`
                    : `${process.env.PUBLIC_URL}/img/default pp.jpg`
                }
                alt="pp"
                className={style.img}
              />
            </div>

            <div className={style.column}>
              <div className={style.column2}>
                <h3 className={style.name}>{username}</h3>
                <div className={style.stats}>
                  {following.length}
                  <p
                    onClick={() => {
                      setShowFollowing(true);
                    }}
                    className={style.muted}
                    style={{ cursor: "pointer" }}
                  >
                    Following
                  </p>
                  {followers.length}
                  <p
                    onClick={() => {
                      setShowFollowers(true);
                    }}
                    className={style.muted}
                    style={{ cursor: "pointer" }}
                  >
                    Followers
                  </p>
                </div>
              </div>
              <p className={style.bio}>{bio}</p>
            </div>

            {Auth?.userId !== userId ? (
              !isFollowed ? (
                <button
                  type="button"
                  onClick={() => {
                    followUserHandler().then(setIsFollowed(!isFollowed));
                  }}
                  className={`pr ${style.followButton}`}
                >
                  <ControlPointIcon sx={{ width: 14, height: 14 }} />
                  Follow
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    followUserHandler().then(setIsFollowed(!isFollowed));
                  }}
                  className={`pr ${style.followButton}`}
                  style={{ background: "#bdbdbd" }}
                >
                  <HighlightOffIcon sx={{ width: 14, height: 14 }} />
                  Following
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
      <div
        style={{ height: `${overflowSpacer / 2 + 48}px` }}
        className={style.overflowSpacer}
      ></div>
      <div className={style.profileContent}>
        <div className={style.contentFilter}>
          <button className={style.filterButton} type="button">
            Tweets
          </button>
          <button className={style.filterButton} type="button">
            Tweets & replies
          </button>
          <button className={style.filterButton} type="button">
            Media
          </button>
          <button className={style.filterButton} type="button">
            Likes
          </button>
        </div>

        {isLoading ? (
          <div style={{ justifySelf: "center", margin: "0 auto" }}>
            <Spinner />
          </div>
        ) : (
          <>
            {tweetsFeed.length > 0 ? (
              <div className={style.contentFeed}>{tweetsFeed.reverse()}</div>
            ) : (
              <div className={style.noTweets}>There are no tweets.</div>
            )}
          </>
        )}
      </div>
      <UsersModal
        header={`${Auth?.username} followers`}
        usersList={followers}
        show={showFollowers}
        off={setShowFollowers}
      />
      <UsersModal
        header={`${Auth?.username} is following`}
        usersList={following}
        show={showFollowing}
        off={setShowFollowing}
      />
    </div>
  );
}
