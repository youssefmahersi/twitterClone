import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../contextes/AuthContext";
import axios from "axios";
import style from "./style.module.css";
import { Button } from "@chakra-ui/react";
import Formdata from "form-data";
import { useHistory } from "react-router-dom";

async function submitUpdate(token, { pc = null, pp = null, data = null }) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json, multipart/form-data",
    },
    credentials: "same-origin",
    mode: "no-cors",
  };

  let response;

  if (pp) {
    let data = new Formdata();
    data.set("image", pp);
    await axios.put(`${process.env.REACT_APP_SERVER_URL}edit/pp`, data, config);
  }
  if (pc) {
    let data = new Formdata();
    data.set("image", pc);
    await axios.put(`${process.env.REACT_APP_SERVER_URL}edit/cp`, data, config);
  }
  if (data) {
    response = await axios.put(
      `${process.env.REACT_APP_SERVER_URL}edit/user-info`,
      data,
      config
    );
  }
  return response;
}

async function getUserDetails(id, token) {
  let response = await axios
    .get(`${process.env.REACT_APP_SERVER_URL}feed/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res);

  return response;
}

export default function Settings() {
  const AuthCON = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profileCover, setProfileCover] = useState("");
  const usernameRef = useRef();
  const bioRef = useRef();
  const profilePictureRef = useRef();
  const profileCoverRef = useRef();
  const history = useHistory();
  const tokenRef = useRef();
  function copyHandler(e) {
    const text = tokenRef.current.innerText;
    navigator.clipboard.writeText(text);
    e.target.innerText = "token copied";
  }

  function userDetailsHandler() {
    getUserDetails(AuthCON.user.userId, AuthCON.user.token).then(({ data }) => {
      const { user } = data;
      setBio(user.bio);
      bioRef.current.value = user.bio;
      setUsername(user.username);
      usernameRef.current.value = user.username;
      setProfilePicture(user.photoProf);
      setProfileCover(user.photoCover);
    });
  }

  function submitHandler(e) {
    let pp, pc;
    if (profilePictureRef.current.files.length > 0) {
      pp = profilePictureRef.current.files[0];
    }
    if (profileCoverRef.current.files.length > 0) {
      pc = profileCoverRef.current.files[0];
    }

    e.preventDefault();
    setIsLoading(true);
    let data = new Formdata();
    if (username !== "") {
      data.set("username", username);
    }
    if (bio !== "") {
      data.set("bio", bio);
    }
    if (password !== "" && password === passwordConfirmation) {
      data.set("password", password);
    }

    submitUpdate(AuthCON.user.token, { data, pp, pc })
      .then((res) => {
        getUserDetails(AuthCON.user.userId, AuthCON.user.token).then((res) => {
          let lsUser = JSON.parse(localStorage.getItem("currentUser"));
          lsUser.username = res.data.user.username;
          lsUser.pp = res.data.user.photoProf;
          localStorage.setItem("currentUser", JSON.stringify(lsUser));
          AuthCON.setUser(lsUser);
          history.push("/profile");
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  //eslint-disable-next-line
  useEffect(userDetailsHandler, []);
  return (
    <form onSubmit={submitHandler}>
      <div className={style.settingsContainer}>
        <input
          type="file"
          name="profileCover"
          id="profileCover"
          accept="image/*"
          style={{ display: "none" }}
          ref={profileCoverRef}
        />
        <input
          type="file"
          name="profilePicture"
          id="profilePicture"
          accept="image/*"
          style={{ display: "none" }}
          ref={profilePictureRef}
        />
        <img
          className={style.pc}
          src={
            profileCover
              ? `${process.env.REACT_APP_SERVER_URL}${profileCover}`
              : `${process.env.PUBLIC_URL}/img/default pc.jpg`
          }
          alt="Profile background"
          onClick={() => {
            profileCoverRef.current.click();
          }}
        />
        <img
          className={style.pp}
          src={
            profilePicture
              ? `${process.env.REACT_APP_SERVER_URL}${profilePicture}`
              : `${process.env.PUBLIC_URL}/img/default pp.jpg`
          }
          alt="Profile pic"
          onClick={() => {
            profilePictureRef.current.click();
          }}
        />
        <h2 style={{ justifySelf: "center", display: "inline" }}>
          {AuthCON.user.username}
        </h2>
        <p
          style={{
            justifySelf: "center",
            marginTop: "-2rem",
            fontSize: "0.9rem",
          }}
        >
          {" "}
          ({AuthCON.user.userId})
        </p>
        <p style={{ display: "none" }} ref={tokenRef}>
          {AuthCON.user.token}
        </p>
        <button
          className={`pr ${style.copyToken}`}
          onClick={copyHandler}
          type="button"
        >
          copy token
        </button>
        <div className={style.textInputList}>
          <label htmlFor="username">Username: </label>
          <input
            className={style.input}
            type="text"
            name="username"
            id="username"
            ref={usernameRef}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />

          <label htmlFor="bio">Biography: </label>
          <textarea
            className={style.input}
            rows="5"
            name="bio"
            id="bio"
            ref={bioRef}
            onChange={(e) => {
              setBio(e.target.value);
            }}
          />

          <label htmlFor="bio">Password: </label>
          <input
            className={style.input}
            type="password"
            name="password"
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <label htmlFor="bio">Password Confirmation: </label>
          <input
            className={style.input}
            type="password"
            name="passwordConfirmation"
            id="passwordConfirmation"
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
          />
        </div>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Updating"
          className={`pr ${style.submitButton}`}
        >
          Update Profile
        </Button>
      </div>
      <div> </div>
    </form>
  );
}
