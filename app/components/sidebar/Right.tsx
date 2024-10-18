"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"; // Ensure framer-motion is installed
import axios from "axios";

const RightSidebar: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        setUsers(response.data.users); // Assuming response has a 'users' property
        setLoading(false); // Set loading to false after fetching users
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Also set loading to false on error
      }
    };
  
    fetchUsers();
  }, []); // Empty dependency array to fetch users only once

  useEffect(() => {
    if (users.length > 0 && selectedUsers.length === 0) {
      // Randomly select 3 users only if none have been selected yet
      const randomUsers = [];
      while (randomUsers.length < 3) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];
        if (!randomUsers.includes(randomUser)) {
          randomUsers.push(randomUser);
        }
      }
      setSelectedUsers(randomUsers);
    }
  }, [users]); // Only runs when users are fetched

  // Loading spinner component
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-purple-600">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <FontAwesomeIcon icon={faCircleNotch} spin size="2x" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="rightSection">
      <div className="requestWidget">
        <h3>Requests</h3>
        {selectedUsers.length > 0 ? (
          selectedUsers.map((user) => (
            <div key={user.id} className="requestProfile">
              <div className="details">
                <div className="profileImage">
                  <img src={user.image} alt={user.firstName} />
                </div>
                <div className="userDetails">
                  <div className="name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="username text-left">@{user.username}</div>
                </div>
              </div>
              <div className="actions">
                <button className="actionBtn">Accept</button>
                <button className="actionBtn">Reject</button>
              </div>
            </div>
          ))
        ) : (
          <p>No users available.</p> // Fallback if no users are found
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
