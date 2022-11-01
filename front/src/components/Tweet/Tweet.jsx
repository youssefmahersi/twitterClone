import style from "./style.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import axios from "axios";
import FormData from "form-data";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";

function Comment({ details, auth, postId }) {
  const [isLiked, setIsLiked] = useState(false);

  function parseCommentLikes() {
    details.likes.forEach((like) => {
      if (like.userId === auth.userId) {
        setIsLiked(true);
      }
    });
  }
  async function likeComment() {
    const data = { postId, commentId: details._id };
    const config = {
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      mode: "no-cors",
    };
    const response = await axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}feed/like-comment`,
        data,
        config
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
    return response;
  }

  useEffect(
    parseCommentLikes,
    // eslint-disable-next-line
    []
  );
  return (
    <div className={style.commentContainer}>
      <Avatar
        variant="rounded"
        src={`${process.env.REACT_APP_SERVER_URL}${details.pp}`}
      />
      <div className={style.commentContentContainer}>
        <div className={style.commentContent}>
          <div className={style.commentContentHeader}>
            <Link to={`/profile/${details.userId}`}>
              <h4 style={{ color: "black" }}>{details.username}</h4>
            </Link>
            <span className={style.commentTime}>{details.time}</span>
          </div>
          {details.content}
          {details.imageUrl ? (
            <img
              className={style.commentImage}
              src={`${process.env.REACT_APP_SERVER_URL}${details.imageUrl}`}
              alt="comment Img"
            />
          ) : null}
        </div>
        <div className={style.commmentStats}>
          <span
            style={{ color: isLiked ? "rgb(var(--r))" : "" }}
            onClick={() => {
              likeComment().then(() => {
                setIsLiked(!isLiked);
              });
            }}
            className={style.commentLike}
          >
            <FavoriteBorderOutlinedIcon fontSize="1rem" />  Like
          </span>
          <span style={{ display: "inline-flex" }} className={style.span}>
            {isLiked ? details.likes.length + 1 : details.likes.length} likes
          </span>
        </div>
      </div>
    </div>
  );
}

async function submitComment(data, token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };

  let response = await axios
    .post(`${process.env.REACT_APP_SERVER_URL}feed/comment-post`, data, config)
    .then((res) => {
      return res;
    });
  return response;
}

async function doAction(action, postId, token) {
  const data = { postId };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };
  var endPoint = "";
  switch (action) {
    case "like":
      endPoint = "like-post";
      break;
    case "save":
      endPoint = "save-tweet";
      break;
    case "retweet":
      endPoint = "retweet-post";
      break;
    default:
      endPoint = "like-post";
  }

  let response = await axios
    .post(`${process.env.REACT_APP_SERVER_URL}feed/${endPoint}`, data, config)
    .then((res) => {
      return res;
    })
    .catch();
  return response;
}

export default function Tweet(props) {
  const [retweetAdds, setRetweetAdds] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsList, setCommentsList] = useState(props.tweet.comments);
  function parseLikes() {
    try {
      props.tweet.likes.forEach((like) => {
        if (props.auth.userId === like.userId) {
          setIsLiked(true);
          throw Error;
        }
      });
    } catch {}
  }
  const [isSaved, setIsSaved] = useState(
    props.tweet.saves.includes(props.auth.userId)
  );
  const [isRetweeted, setIsRetweeted] = useState(
    props.tweet.retweets.includes(props.auth.userId)
  );
  const tweetImage = (
    <img
      className={style.tweetImage}
      src={`${process.env.REACT_APP_SERVER_URL}${props.tweet.imageUrl}`}
      alt="tweet"
    />
  );

  const commentInputRef = useRef();
  const uploadRef = useRef();
  function submitHandler(e) {
    e.preventDefault();
    const commentContent = commentInputRef.current.value;
    if (commentContent.length >= 4) {
      commentInputRef.current.value = "";
      let data = new FormData();
      data.set("postId", props.tweet._id);
      data.set("content", commentContent);

      if (uploadRef.current.files.length > 0) {
        const img = uploadRef.current.files[0];
        data.set("image", img);
      }
      submitComment(data, props.auth.token).then((res) => {
        setCommentsList([...commentsList, res.data.comment]);
      });
    }
  }

  useEffect(() => {
    parseLikes();
    // eslint-disable-next-line
  }, []);

  function chooseFileHandler() {
    uploadRef.current.click();
  }

  //show only first 3 comments
  const comments = commentsList
    .slice(0, 3)
    .map((comment) => (
      <Comment
        key={comment._id}
        details={comment}
        auth={props.auth}
        postId={props.tweet._id}
      />
    ));
  const commentsFeed = commentsList.map((comment) => (
    <Comment
      key={comment._id}
      details={comment}
      auth={props.auth}
      postId={props.tweet._id}
    />
  ));

  const [showComments, setShowComments] = useState(false);

  return (
    <>
      {props.type === "retweet" && (
        <div className={style.retweetTag}>
          <AutorenewOutlinedIcon />
          {props.status.substring(0, props.status.length - 10)} Retweeted
        </div>
      )}
      <div className={style.tweetContainer}>
        <div className={style.tweetAuth}>
          <Avatar
            variant="rounded"
            src={`${process.env.REACT_APP_SERVER_URL}${props.tweet.pp}`}
          />

          <div className={style.authStats}>
            <Link to={`/profile/${props.tweet.userId}`}>
              <h4 className={style.authName}>{props.tweet.username}</h4>
            </Link>
            <p className={style.tweetDate}>{props.tweet.timeCreated}</p>
          </div>
        </div>
        <p className={style.tweetCaption}>{props.tweet.comment}</p>
        <div>{props.tweet.imageUrl ? tweetImage : ""}</div>
        <div className={style.tweetStats}>
          <div className={style.stat}>{commentsFeed.length} Comments</div>
          <div className={style.stat}>
            {retweetAdds + props.tweet.retweets.length} Retweets
          </div>
          <div className={style.stat}>
            {isSaved ? 1 + props.tweet.saves.length : props.tweet.saves.length}{" "}
            Saved
          </div>
        </div>
        <div className={style.tweetActions}>
          <button
            onClick={() => {
              setShowComments(true);
            }}
            className={style.actionButton}
          >
            <ModeCommentOutlinedIcon />
            <p className={style.buttonText}>Comments</p>
          </button>
          <button
            onClick={(e) => {
              e.target.disabled = true;
              doAction("retweet", props.tweet._id, props.auth.token)
                .then((res) => {
                  if (!isRetweeted) {
                    setIsRetweeted(true);
                  }
                  setRetweetAdds(retweetAdds + 1);
                })
                .finally(() => {
                  e.target.disabled = false;
                });
            }}
            style={isRetweeted ? { color: "rgb(var(--g))" } : null}
            className={style.actionButton}
          >
            <AutorenewOutlinedIcon />{" "}
            <p className={style.buttonText}>Retweet</p>
          </button>
          <button
            onClick={() => {
              doAction("like", props.tweet._id, props.auth.token).then((res) =>
                setIsLiked(!isLiked)
              );
            }}
            style={isLiked ? { color: "rgb(var(--r))" } : null}
            className={style.actionButton}
          >
            <FavoriteBorderOutlinedIcon />
            <p className={style.buttonText}>Like</p>
          </button>
          <button
            onClick={() => {
              doAction("save", props.tweet._id, props.auth.token).then(
                (res) => {
                  setIsSaved(!isSaved);
                }
              );
            }}
            style={isSaved ? { color: "rgb(var(--b))" } : null}
            className={style.actionButton}
          >
            <BookmarkBorderOutlinedIcon />
            <p className={style.buttonText}> Bookmark</p>
          </button>
        </div>
        <div className={style.tweetComment}>
          <Avatar
            variant="rounded"
            src={`${process.env.REACT_APP_SERVER_URL}${props.auth.pp}`}
          />

          <form className={style.commentForm} onSubmit={submitHandler}>
            <input
              ref={commentInputRef}
              className={style.commentInput}
              type="text"
              placeholder="Tweet your reply"
            />
            <span className={style.commentImageUpload}>
              <input
                ref={uploadRef}
                id="file"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
              />
              <InsertPhotoOutlinedIcon onClick={chooseFileHandler} />
            </span>
          </form>
        </div>
        {comments.length > 0 ? (
          <div className={style.commentSection}>
            {comments}
            <p
              onClick={() => setShowComments(true)}
              style={{
                fontWeight: 500,
                fontSize: "0.856rem",
                color: "rgb(var(--sd-text))",
                marginTop: "1rem",
                marginBottom: "-1rem",
                cursor: "pointer",
              }}
            >
              {commentsFeed.length - 3 > 0 &&
                `+ ${commentsFeed.length - 3} other comments`}
            </p>
          </div>
        ) : null}
        <div
          className={style.commentsModal}
          style={{ display: !showComments && "none" }}
        >
          <div
            onClick={() => {
              setShowComments(false);
            }}
            className={style.dummyBackground}
          />
          <div className={style.commentsModalContainer}>{commentsFeed}</div>
        </div>
      </div>
    </>
  );
}
