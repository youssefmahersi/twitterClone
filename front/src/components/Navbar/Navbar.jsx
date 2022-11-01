import React, { useContext, useState } from "react";
import style from "./styles.module.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../auth/auth";
import { AuthContext } from "../../contextes/AuthContext";
import { useHistory } from "react-router-dom";

function ClickAwayMask(props) {
  return (
    <div
      onClick={props.onClickHandler}
      className={`${style.mask}${!props.on ? ` ${style.invisible}` : ""}`}
    ></div>
  );
}

function Bar(props) {
  return (
    <div className={`${style.bar}${props.active ? ` ${style.activeBar}` : ""}`}>
      <Link
        onClick={props.clickHandler}
        to={`/${props.name.toLowerCase()}`}
        children={props.name}
      />
    </div>
  );
}

export default function Navbar(props) {
  const [optionsTab, toggleOptionstab] = useState(false);
  const history = useHistory();
  const bars = ["Home", "Explore", "Bookmarks"];
  const Auth = useContext(AuthContext);

  function optionsTabHandler() {
    toggleOptionstab(!optionsTab);
  }

  return (
    <NavbarProvider>
      <NavbarContext.Consumer>
        {(Nav) => {
          function clickHandler(bar) {
            setActiveBar(bar);
          }
          const { activeBar, setActiveBar } = Nav;
          const barsList = bars.map((name) => {
            return (
              <Bar
                clickHandler={() => clickHandler(name)}
                key={name}
                name={name}
                active={name === activeBar ? true : false}
              />
            );
          });

          return (
            <>
              <div
                onClick={() => {
                  if (optionsTab) {
                    optionsTabHandler();
                  }
                }}
                className={style.wrapper}
              >
                <ClickAwayMask
                  onClickHandler={optionsTabHandler}
                  on={optionsTab}
                ></ClickAwayMask>
                <div className={style.navbar}>
                  <Link
                    onClick={() => clickHandler("Home")}
                    to="/home"
                    className={style.navbarLogo}
                  >
                    <picture>
                      <source
                        srcSet={`${process.env.PUBLIC_URL}/img/tweeter-small.svg`}
                        media="(max-width: 540px)"
                      />
                      <img
                        src={`${process.env.PUBLIC_URL}/img/tweeter.svg`}
                        alt="logo"
                      />
                    </picture>
                  </Link>
                  <div className={style.navbarList}>{barsList}</div>
                  <div className={style.navbarOptions}>
                    <div className={style.user}>
                      <Avatar
                        sx={{ width: "32px", height: "32px" }}
                        variant="rounded"
                        src={`${process.env.REACT_APP_SERVER_URL}${Auth.user?.pp}`}
                      ></Avatar>
                      <div
                        onClick={optionsTabHandler}
                        className={style.userName}
                      >
                        {props.username}
                        <ArrowDropDownIcon></ArrowDropDownIcon>
                      </div>
                      <div
                        className={`bs-1 ${style.optionsContainer}${
                          !optionsTab ? ` ${style.invisible}` : ""
                        }`}
                      >
                        <div className={style.options}>
                          <div className={style.optionsList}>
                            <Link
                              onClick={() => clickHandler("")}
                              to="/profile"
                              className={style.option}
                            >
                              <AccountCircleIcon />
                              <div>Profile</div>
                            </Link>
                            <Link
                              onClick={() => clickHandler("")}
                              to="/group chat"
                              className={style.option}
                            >
                              <GroupIcon />
                              <div>Group Chat</div>
                            </Link>
                            <Link
                              onClick={() => clickHandler("")}
                              to="/settings"
                              className={style.option}
                            >
                              <SettingsIcon />
                              <div>Settings</div>
                            </Link>
                          </div>
                          <div
                            onClick={() => {
                              logout(Auth);

                              history.push("/home");
                            }}
                            className={style.logoutOption}
                          >
                            <LogoutIcon color="inherit" />
                            <div>Log Out</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="content">{props.children}</div>
              <footer className={style.mobileBarList}>
                <div
                  onClick={() => clickHandler("Home")}
                  className={`${style.mobileBar}${
                    "Home" === activeBar ? ` ${style.activeBar}` : ""
                  }`}
                >
                  <Link to="/home">
                    <HomeIcon color="inherit" />
                  </Link>
                </div>
                <div
                  onClick={() => clickHandler("Explore")}
                  className={`${style.mobileBar}${
                    "Explore" === activeBar ? ` ${style.activeBar}` : ""
                  }`}
                >
                  <Link to="/explore">
                    <ExploreIcon color="inherit" />
                  </Link>
                </div>
                <div
                  onClick={() => clickHandler("Bookmarks")}
                  className={`${style.mobileBar}${
                    "Bookmarks" === activeBar ? ` ${style.activeBar}` : ""
                  }`}
                >
                  <Link to="/bookmarks">
                    <BookmarkIcon color="inherit" />
                  </Link>
                </div>
              </footer>
            </>
          );
        }}
      </NavbarContext.Consumer>
    </NavbarProvider>
  );
}

export const NavbarContext = React.createContext("");
export function NavbarProvider({ children }) {
  const [activeBar, setActiveBar] = useState("Home");
  const value = {
    activeBar: activeBar,
    setActiveBar: setActiveBar,
  };
  return <NavbarContext.Provider value={value} children={children} />;
}
