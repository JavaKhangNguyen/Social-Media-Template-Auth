"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBookBookmark, faHome } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

const links = [
  {
    name: "Home",
    icon: <FontAwesomeIcon icon={faHome} />,
  },
  {
    name: "Notifications",
    icon: <FontAwesomeIcon icon={faBell} />,
  },
  {
    name: "Bookmarks",
    icon: <FontAwesomeIcon icon={faBookBookmark} />,
  },
];

const LeftSidebar: React.FC = () => {
  const {user} = useUser();

  const containerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="leftSection"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="userProfileWidget" variants={itemVariants}>
        <div className="profileImage">
          <img src={user?.imageUrl} alt="" />
        </div>
        <div className="userDetails">
          <div className="font-semibold text-gray-900 hover:text-[#8043cc] transition-colors duration-300">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="username">@{user?.username}</div>
        </div>
      </motion.div>

      <motion.div className="inSidebar" variants={itemVariants}>
        {links.map((link, index) => (
          <motion.div className="link" key={index} variants={itemVariants}>
            <div className="icon">{link.icon}</div>
            <h3>{link.name}</h3>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LeftSidebar;