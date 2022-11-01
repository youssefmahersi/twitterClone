import style from "./style.module.css";
import React, { useState, useEffect, useContext } from "react";
import Tweet from "../Tweet/Tweet";
import { CircularProgress as Spinner } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../contextes/AuthContext";

async function getBookmarks(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };
  let response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}feed/bookmarks`,
    config
  );

  return response;
}

export default function Bookmarks() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkList, setBookmarkList] = useState([]);
  const Auth = useContext(AuthContext);

  const bookmarksFeed = bookmarkList.map((tweet) => (
    <Tweet style={{ margin: "auto" }} tweet={tweet} auth={Auth?.user} />
  ));
  useEffect(() => {
    setIsLoading(true);
    getBookmarks(Auth?.user?.token)
      .then((res) => {
        setBookmarkList(res.data.bookmarks);
      })
      .finally(() => {
        setIsLoading(false);
      });
    //eslint-disable-next-line
  }, []);
  return (
    <div className={style.BookmarksContainer}>
      {isLoading ? (
        <div
          style={{ margin: "auto", display: "grid", justifyContent: "center" }}
        >
          <Spinner />
        </div>
      ) : (
        <>
          {bookmarkList.length > 0 ? (
            bookmarksFeed
          ) : (
            <div className={style.noTweets}>There are no tweets.</div>
          )}
        </>
      )}
    </div>
  );
}
