import React from "react";
import Stack from "@mui/joy/Stack";
import Item from "@mui/joy/Stack";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { Post } from "./Post";

const TagOne = () => {
  const [data, setData] = React.useState();
  const { name } = useParams();

  React.useEffect(() => {
    axios
      .get(`posts/withtags`, {
        params:{
          tags: [name]
        }
      })
      .then((res) => {
        //alert(JSON.stringify(res.data));
        setData(res.data);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка получения тэгов");
      });
  }, [name]);

  const tagName = name;//.toUpperCase();

  return (
    <div>
      <h1>{`#${tagName}`}</h1>
      <Stack spacing={2}>
        {data?.map((obj, index) => (
          <Item key={index}>
            {" "}
            <Post
              id={obj._id}
              title={obj.title}
              imageUrl={
                obj.imageUrl
                  ? `${axios.defaults.baseURL}${obj.imageUrl}`
                  : ""
              }
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              likesCount={obj.likesCount}
              commentsCount={obj.comments.length}
              tags={obj.tags}
              isEditable={false}
            />
          </Item>
        ))}
      </Stack>
    </div>
  );
};

export default TagOne;
