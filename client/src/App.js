import Container from "@mui/material/Container";
import { Routes, Router, Route } from "react-router-dom";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import React from "react";
import TagOne from "./components/TagOne";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route key="home-route" exact path="/" element={<Home />} />
          <Route key="post-route" path="/posts/:id" element={<FullPost />} />
          <Route key="add-post-route" path="/add-post" element={<AddPost />} />
          <Route key="login-route" path="/login" element={<Login />} />
          <Route key="register-route" path="/register" element={<Registration />} />
          <Route key="tags-names-route" path="/tags/:name" element={<TagOne />} />
          <Route key="post-edit-route" path="/posts/:id/edit" element={<AddPost />} />
          {/* <Route key="add-comment-route" path="/posts/:id/comments" element={<AddComment />} /> */}
        </Routes>
      </Container>
    </>
  );
}

export default App;
