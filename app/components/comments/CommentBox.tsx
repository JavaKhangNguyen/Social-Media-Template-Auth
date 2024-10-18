"use client";
import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';

interface CommentBoxProps {
  postId: number; 
  onNewComment: (newComment: any) => void; 
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId, onNewComment }) => {
  const [comment, setComment] = useState('');
  const {authUser, setAuthUser} = useAuthStore();

  // Borrow the userid from the API directly because Clerk handle user ID differently
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/20`);
        if (!response.status) {
          throw new Error("Failed to fetch user");
        }
        setAuthUser(response.data); 
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUser();
  }, [setAuthUser]);


  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleCommentSubmit(); // Trigger the comment submission
    }
  };

  // Function to handle comment submission
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    const newComment = {
      body: comment, 
      postId: postId, 
      userId: authUser?.id, 
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting comment:", errorData);
      } else {
        const data = await response.json();
        onNewComment(data);
        console.log("Comment successfully added:", data);
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  
    setComment(""); // Clear the textarea after submission
  };

  return (
    <>
    <div className="commentBox">
      <textarea
        value={comment}
        onChange={handleCommentChange}
        onKeyDown={handleKeyDown} 
        placeholder="Write a comment..."
        rows={2}
      />
      <button onClick={handleCommentSubmit}>
        <FontAwesomeIcon icon={faPaperPlane} beatFade />
      </button>
    </div>
    </>
  );
};

export default CommentBox;
