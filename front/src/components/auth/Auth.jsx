import React, { useState, useContext } from "react";
import { signUp, login } from "./auth";
import style from "./style.module.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contextes/AuthContext";
import { Redirect } from "react-router";
import { Button, Image } from "@chakra-ui/react";

function Field({ name, type, error }) {
  return (
    <div className={style.field}>
      <div className={style.fieldContent}>
        <p className={style.fieldName}>{name}:</p>
        <input
          className={style.fieldInput}
          type={type}
          name={type}
          style={error && { border: "2px solid rgb(va(--r))" }}
          placeholder={name}
        />
      </div>
      {error && <p className={style.fieldError}>{error}</p>}
    </div>
  );
}

export function Form({
  submitHandler,
  buttonText,
  redirect,
  fields,
  loading,
  errors,
  loginError,
  title,
}) {
  const Auth = useContext(AuthContext);

  const fieldsList = fields.map((field) => {
    let error = null;
    errors.forEach((err) => {
      if (err.param === field.type) {
        error = err.msg;
      }
    });
    return (
      <Field
        key={field.name}
        name={field.name}
        type={field.type}
        error={error}
      />
    );
  });
  if (!Auth.user) {
    return (
      <div className={style.container}>
        <form className={`bs-2 ${style.form}`} onSubmit={submitHandler}>
          <Image
            className={style.logo}
            src={`${process.env.PUBLIC_URL}/img/tweeter.svg`}
          ></Image>
          <h1 className={style.formTitle}>{title}</h1>
          <div className={style.fieldsList}>{fieldsList}</div>
          <div className={style.bottomSection}>
            <p className={style.muted}>
              {redirect.text}
              <Link className={style.redirectLink} to={`/${redirect.link}`}>
                {redirect.link}
              </Link>
            </p>
            <Button
              loadingText={buttonText}
              isLoading={loading}
              className={`pr ${style.submitButton}`}
              type="submit"
            >
              {buttonText}
            </Button>
            {loginError && <p className={style.fieldError}>{loginError}</p>}
          </div>
        </form>
        <p className={style.tradeMark}>
          © 2021 - Tweeter™. All rights reserved.
        </p>
      </div>
    );
  } else {
    return <Redirect to="/home" />;
  }
}

export function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const Auth = useContext(AuthContext);
  const fields = [
    { name: "Username", type: "username" },
    { name: "E-mail", type: "email" },
    { name: "Password", type: "password" },
    { name: "Password Confirmation", type: "password" },
  ];

  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    let data = {};
    for (let i = 0; i < e.target.length - 1; i++) {
      data[`${e.target[i].name}`] = e.target[i].value;
    }
    signUp(data.username, data.email, data.password)
      .then(() => {
        login(data.email, data.password).then((res) => {
          localStorage.setItem("currentUser", JSON.stringify(res.data));
          Auth.setUser(res.data);
        });
      })
      .catch((e) => {
        setErrors(e.response.data.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <Form
      title={"Create an account"}
      fields={fields}
      buttonText="Sign up"
      redirect={{ text: "Already have an account? ", link: "Login" }}
      submitHandler={submitHandler}
      loading={isLoading}
      errors={errors}
    />
  );
}

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const Auth = useContext(AuthContext);
  const fields = [
    { name: "E-mail", type: "email" },
    { name: "Password", type: "password" },
  ];

  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    let data = {};
    for (let i = 0; i < e.target.length - 1; i++) {
      data[`${e.target[i].name}`] = e.target[i].value;
    }
    login(data.email, data.password)
      .then((res) => {
        const user = { ...res.data, loginTime: Date.now() };
        localStorage.setItem("currentUser", JSON.stringify(user));
        Auth.setUser(user);
      })
      .catch((e) => {
        setError(e?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Form
      title={"Login to your account"}
      fields={fields}
      buttonText="Login"
      redirect={{ text: "Don't have an account? ", link: "Signup" }}
      submitHandler={submitHandler}
      loading={isLoading}
      errors={[]}
      loginError={error}
    />
  );
}
