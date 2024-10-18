"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleNotch, faEye, faThumbsUp, faThumbsDown} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import axios from "axios";

import CommentBox from "../comments/CommentBox";
import CommentCard from "../comments/CommentCard";

interface PostProps {
  selectedFilter: string;
  searchResults: any[];
}

const Post: React.FC<PostProps> = ({ selectedFilter, searchResults }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [postsLoading, setPostsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const commentBoxVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  // Handle notifications
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
  };
 
  // Fetch posts and users concurrently
  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const postsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        if (postsResponse.status !== 200) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = postsResponse.data
        setPosts(postsData.posts);

        const uniqueUserIds = [
          ...new Set(postsData.posts.map((post) => post.userId)),
        ];
        const userPromises = uniqueUserIds.map((userId) =>
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`).then(
            (res) => {
              if (res.status !== 200) {
                throw new Error(`Failed to fetch user with ID: ${userId}`);
              }
              return res.data;
            }
          )
        );

        const userData = await Promise.all(userPromises);
        const userMap = userData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUsers(userMap);
      } catch (error) {
        setError(error.message);
      } finally {
        setPostsLoading(false);
        setUsersLoading(false);
      }
    };

    fetchPostsAndUsers();
  }, []);

  // Search posts
  useEffect(() => {
    if (searchResults.length > 0) {
      setPosts(searchResults); // If there are search results, show them
      setPostsLoading(false);
    } else {
      // Fetch posts normally if no search results
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
        .then((response) => {
          if (!response.status) {
            throw new Error("Failed to fetch posts");
          }
          setPosts(response.data.posts)
        })
        .catch((error) => setError(error.message))
        .finally(() => setPostsLoading(false));
    }
  }, [searchResults]);

  // Fetch comments
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments?limit=0`)
      .then((response) => {
        if (!response.status) {
          throw new Error("Failed to fetch comments");
        }
        return response.data;
      })
      .then((data) => setComments(data.comments))
      .catch((error) => setError(error.message));
  }, []);

  // Sorting logic based on filter with memoization
  const sortedPosts = useMemo(() => {
    switch (selectedFilter) {
      case "Most views":
        return [...posts].sort((a, b) => b.views - a.views);
      case "Most comments":
        return [...posts].sort(
          (a, b) =>
            comments.filter((comment) => comment.postId === b.id).length -
            comments.filter((comment) => comment.postId === a.id).length
        );
      case "Most likes":
        return [...posts].sort((a, b) => b.reactions.likes - a.reactions.likes);
      default:
        return posts;
    }
  }, [selectedFilter, posts, comments]);

  // Show error message if any fetch failed
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  // Show loading spinner while either posts or users are still loading
  if (postsLoading || usersLoading ) {
    return (
      <div className="flex justify-center items-center h-screen text-purple-600">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <FontAwesomeIcon icon={faCircleNotch} spin size="3x" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {sortedPosts.map((post) => (
        <motion.div
          key={post.id}
          className="postWrapper p-4 bg-white rounded shadow mb-6"
          initial="hidden"
          animate="visible"
          variants={postVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center mb-4">
            <img
              src={
                users[post.userId]?.image || `https://via.placeholder.com/50`
              }
              alt="user profile"
              className="profileImg rounded-full w-12 h-12 mr-3"
            />
            <div className="userDetails">
              <div className="font-semibold text-lg">
                {users[post.userId]? `${users[post.userId].firstName} ${users[post.userId].lastName}`
                : usersLoading}
              </div>
            </div>
          </div>
          <div className="mainPostContent mb-4">
            <div className="postBody text-gray-800">{post.body}</div>
          </div>
          <div className="text-left mt-2 mb-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="postTags">
                #{tag}
              </span>
            ))}
          </div>
          <div className="postStats">
            <div className="postStat">
              <span>
                <FontAwesomeIcon icon={faEye} /> {post.views}
              </span>
            </div>
            <div className="postStat">
              <span>
                <FontAwesomeIcon icon={faThumbsUp} /> {post.reactions.likes}
              </span>
            </div>
            <div className="postStat">
              <span>
                <FontAwesomeIcon icon={faThumbsDown} />{" "}
                {post.reactions.dislikes}
              </span>
            </div>
          </div>
          <motion.div
            className="postFooter"
            initial="hidden"
            animate="visible"
            variants={commentBoxVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="commentSection">
              <div className="commentList">
              {comments
                .filter((comment) => comment.postId === post.id)
                .map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
              <CommentBox
              postId={post.id}
              onNewComment={(newComment) => {
                setComments([newComment, ...comments]);
                setIsOpen(true);
              }}
              />
            </div>
          </motion.div>
        </motion.div>
      ))}
      <Snackbar
        open={isOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={3000} // Increased to 3000ms
        onClose={handleClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Comment uploaded!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Post;
