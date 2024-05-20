import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      nickname: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    if (!data.payload) {
      alert("Не удалось зарегистрироваться");
      return;
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Регистрация
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="ФИО"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Введите ФИО" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Никнейм"
          error={Boolean(errors.nickname?.message)}
          helperText={errors.nickname?.message}
          {...register("nickname", { required: "Введите никнейм" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Enter a email" })}
        />
        <TextField
          className={styles.field}
          label="Password"
          fullWidth
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Enter a password" })}
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Создать аккаунт
        </Button>
      </form>
    </Paper>
  );
};
