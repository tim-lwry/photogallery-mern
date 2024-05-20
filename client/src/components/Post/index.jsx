import React, { useEffect } from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLikePost, fetchRemovePost } from '../../redux/slices/posts';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  likesCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const isEditablePost = userData?._id === user?._id;
  const navigate = useNavigate();
  //const [likesCounter, setLikes] = React.useState(Array.isArray(likesCount)?likesCount.length:0);
  //const { likes } = useSelector((state) => state.posts);

  // useEffect(()=>{
  //   alert(typeof(likesCount))
  //   if(!Array.isArray(likesCount)){
  //     likesCount = [];
  //   }
  //   setLikes(likesCounter => likesCount.length);
  // }, []);

  if (isLoading) {
    return <PostSkeleton />;
  };

  const onClickLike = () => {
    dispatch(fetchLikePost(id));
    navigate(0);
    //alert(JSON.stringify(likes));
    //let likes = likesCounter;
    // return;
    // if(Array.isArray(likesCount) && likesCount?.includes(userData._id)){
    //   likesCount.filter(l => l !== userData?._id);
    //   setLikes(likesCounter => likesCounter-1);
    //   //alert("remove");
    // }
    // else{
    //   //likes.push(userData._id);
    //   //likesCounter.push(userData._id);
      
    //   likesCount.push(userData._id);
    //   setLikes(likesCounter => likesCounter+1);
      
    // }
    //alert(likes);

    //navigate(0);
  };

  const onClickRemove = () => {
    if (window.confirm("Вы уверены, что хотите удалить данный пост?")) {
      dispatch(fetchRemovePost(id));
      navigate(0);
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              {userData?._id != null &&
                <ThumbUpIcon onClick={onClickLike} />
              }
              {userData?._id == null &&
                <ThumbUpIcon />
              }
              <span>{likesCount.length}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
