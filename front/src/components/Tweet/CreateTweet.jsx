import React, { useState, useContext, useRef } from "react";
import { Avatar } from "@mui/material";
import style from "./style.module.css";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import PeopleIcon from "@mui/icons-material/People";
import axios from "axios";
import { AuthContext } from "../../contextes/AuthContext";
import FormData from "form-data";
import PublicIcon from "@mui/icons-material/Public";
import { Button } from "@chakra-ui/react";

export default function CreateTweet(props) {
  const Auth = useContext(AuthContext);
  const [caption, setCaption] = useState("");
  const [isPublic, toggleIsPublic] = useState(true);
  const [optionGroup, toggleOptionGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const uploadRef = useRef();
  const textRef = useRef();

  function changeHandler(e) {
    setCaption(e.target.value);
  }

  function submitHandler(e) {
    setIsLoading(true);
    e.preventDefault();
    let data = new FormData();
    data.set("privacy", !isPublic);
    data.set("comment", caption);
    if (uploadRef.current.files.length > 0) {
      const img = uploadRef.current.files[0];
      data.set("image", img);
    }
    const config = {
      headers: {
        Authorization: `Bearer ${Auth.user.token}`,
        "Content-Type": "multipart/form-data",
      },
      credentials: "same-origin",
      mode: "no-cors",
    };
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}feed/create-tweet`,
        data,
        config
      )
      .then(() => {
        textRef.current.value = "";
        setCaption("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function chooseFileHandler() {
    uploadRef.current.click();
  }

  function optionsHandler() {
    toggleOptionGroup(!optionGroup);
  }
  function publicHandler(p) {
    toggleIsPublic(p);
  }

  return (
    <form onSubmit={submitHandler} className={style.createTweetContainer}>
      <h4 className={style.title}>Tweet something</h4>
      <div className={style.createTweetInput}>
        <Avatar
          src={
            Auth?.user?.pp
              ? `${process.env.REACT_APP_SERVER_URL}${Auth?.user?.pp}`
              : `pp.jpg`
          }
          variant="rounded"
        />
        <input
          ref={textRef}
          onChange={changeHandler}
          placeholder="Whats happening"
        />
      </div>
      <div className={style.createTweetActions}>
        <button type="button" className={style.tweetButton}>
          <input
            ref={uploadRef}
            id="file"
            accept="image/*"
            type="file"
            style={{ display: "none" }}
          />
          <span className={style.span}>
            <InsertPhotoOutlinedIcon onClick={chooseFileHandler} />
          </span>
        </button>
        <span className={style.span}>
          <button
            onClick={optionsHandler}
            type="button"
            className={style.tweetButton}
          >
            {isPublic ? <PublicIcon /> : <PeopleIcon />}
            {isPublic ? "Everyone can reply" : "Followers can reply"}
          </button>
          <div
            className={`${style.optionGroup} ${optionGroup ? "" : "hidden"}`}
          >
            <h4 className={style.optionGroupHeading}>Who can reply?</h4>
            <p className={style.optionGroupDesc}>
              Choose who can reply to this Tweet.
            </p>
            <button
              type="button"
              onClick={() => {
                publicHandler(true);
                toggleOptionGroup(false);
              }}
              className={style.option}
            >
              <PublicIcon /> Everyone can reply
            </button>
            <button
              type="button"
              onClick={() => {
                publicHandler(false);
                toggleOptionGroup(false);
              }}
              className={style.option}
            >
              <PeopleIcon /> Followers can reply
            </button>
          </div>
        </span>

        <Button
          isLoading={isLoading}
          loadingText="tweeting"
          disabled={isLoading}
          type="submit"
          className="pr"
        >
          Tweet
        </Button>
      </div>
    </form>
  );
}
