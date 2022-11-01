import React, { useState, useEffect } from "react";
import { useAuth } from "../../contextes/AuthContext";
import CreateTweet from "../Tweet/CreateTweet";
import style from "./style.module.css";
import Tweet from "../Tweet/Tweet";
import axios from "axios";
import { CircularProgress as Spinner } from "@mui/material";

async function getTweetsFeed(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };
  let response = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}feed/followers-posts`, config)
    .then((res) => {
      return res?.data?.posts;
    });
  return response;
}

export default function Home() {
  const Auth = useAuth();
  const [tweetList, setTweetList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const tweetFeed = tweetList.map((tweet) => (
    <Tweet
      key={Math.random()}
      auth={Auth}
      type={tweet.type}
      tweet={tweet.tweet}
      status={tweet.status}
    />
  ));

  useEffect(() => {
    setIsLoading(true);
    getTweetsFeed(Auth?.token)
      .then((res) => {
        setTweetList(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={style.homeContainer}>
      <div className={style.homeFeed}>
        <CreateTweet />
        {isLoading ? (
          <div style={{ margin: "auto" }}>
            <Spinner />
          </div>
        ) : (
          <>
            {tweetFeed.length > 0 ? (
              tweetFeed
            ) : (
              <div className={style.noTweets}>There are no tweets.</div>
            )}
          </>
        )}
      </div>
      <div className={style.homeSuggestions}></div>
    </div>
  );
}
