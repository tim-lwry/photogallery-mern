import Container from "@mui/material/Container";
import { Routes, Router, Route } from "react-router-dom";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";

function App() {
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
        </Routes>
      </Container>
    </>
  );
}

export default App;
