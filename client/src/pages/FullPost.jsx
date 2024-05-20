import React from "react";
import { useParams } from "react-router-dom";

import { Post } from "../components";
import { Index } from "../components";
import { CommentsBlock } from "../components";
import axios from "../axios";

import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";

export const FullPost = () => {
  const [data, setData] = React.useState("");
  const [comments, setComments] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();
  const userData = useSelector((state) => state.auth.data);


  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setComments(res.data.comments);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Не удалось получить пост");
      });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={
          data.imageUrl
            ? `${axios.defaults.baseURL}${data.imageUrl}`
            : "/notfound.png"
        }
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        likesCount={data.likesCount.length}
        commentsCount={data.comments.length}
        tags={data.tags}
        isEditable={userData?._id === data.user?._id}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        data={data}
        comments={comments}
        setComments={setComments}
        isLoading={false}
        authorId={data.user._id}
      >
        {userData?._id != null &&
          <Index
            id={data._id}
            data={data}
            comments={comments}
            setComments={setComments}
          />
        }
      </CommentsBlock>
    </>
  );
};
