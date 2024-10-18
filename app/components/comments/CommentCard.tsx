"use client"
import React, {useState, useEffect} from 'react';
import axios from 'axios';

interface CommentCardProps {
  comment: {
    id: number;
    body: string;
    user: {
      id: number;
      fullName: string;
      username: string;
    };
  };
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const [userImage, setUserImage] = useState<string>(''); // State to store user image

  useEffect(() => {
    // Fetch user data to get the image
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${comment.user.id}`)
      .then((response) => setUserImage(response.data.image)) // Set the user image
  }, [comment.user.id]);

  return (
    <>
    <div className="commentCard">
      <img
        src={userImage}
        className="avatar"
      />
      <div className="commentContent">
      <div className="font-semibold text-left">
        {comment.user.fullName}
      </div>
      <div className="commentBody">
        {comment.body}
      </div>
      </div>
    </div></>
  );
};

export default CommentCard;
