import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from "react-redux";
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';
import { fetchComments, fetchPosts, fetchSortByNewest, fetchSortByPopularity, fetchTags } from '../redux/slices/posts';

export const Home = () => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments } = useSelector((state) => state.posts);

  const isPostLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const isCommentsLoading = comments.status === "loading";

  React.useEffect(()=>{
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments()); 
  }, []);

  const onSortByNewest = () => {
    dispatch(fetchSortByNewest());
  };

  const onSortByPopularity = () => {
    dispatch(fetchSortByPopularity());
  };

  const handleChange = (event, newValue) => {
    return setValue(newValue);
  };

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={value} aria-label="basic tabs example"
      onChange={handleChange}>
        <Tab value={0} onClick={onSortByPopularity} label="Популярные" />
        <Tab value={1} onClick={onSortByNewest} label="Новые" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? `${axios.defaults.baseURL}${obj.imageUrl}`
                    : ""
                }
                user={obj.user}
                createdAt={new Date(obj.createdAt).toLocaleString('ru-RU')}
                likesCount={obj.likesCount}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user?._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            comments={comments.items}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
