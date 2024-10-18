"use client";
import Link from "next/link";
import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useClickOutside } from "@mantine/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faMagnifyingGlass, faXmark, faAngleRight, 
        faAngleDown, faFilter, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useUser, useClerk } from "@clerk/nextjs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";

// Define types for post data
interface Post {
  id: number;
  title: string;
  body: string;
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  tags: string[];
  userId: number;
}

interface NavbarProps {
  selectedFilter: string;
  onFilterSelect: (filter: string) => void;
  onSearchResults: (posts: []) => void;
}

const Navbar: React.FC<NavbarProps> = ({ selectedFilter, onFilterSelect, onSearchResults }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const ref = useClickOutside(() => setIsFocused(false));
  const [searchValue, setSearchValue] = useState<string>("");
  const [ProfileMenu, setProfileMenu] = useState<boolean>(false);
  const [searchPanel, setSearchPanel] = useState<boolean>(false);

  // Setup for menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Define filter options
  const filterOptions = ["All", "Most comments", "Most views", "Most likes"];
    
  // Handle opening and closing the menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Grab the authUser
  const { user } = useUser();

  // Grab the signOut and openUserProfile methods
  const { signOut, openUserProfile } = useClerk()

  // Search for posts based on searchValue and trigger search on Enter key press
  const searchPosts = (value: string): void => {
    if (value.trim() === "") return;

    axios.get(`https://dummyjson.com/posts/search?q=${value}`)
      .then((res) => res.data)
      .then((data) => {
        if (data.posts) {
          onSearchResults(data.posts); // Pass the search results back to the parent
        } else {
          onSearchResults([]); // If no posts found, pass an empty array
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        onSearchResults([]); // If an error occurs, pass an empty array
      });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim() !== "") {
      searchPosts(searchValue);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".userProfile")) {
        setProfileMenu(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="inNavbar">
        <Link href={"/"} className="inLogo">
          Nguyen Phuc Khang
        </Link>
        <div ref={ref} className={`inSearch ${isFocused ? "inSearchFocused" : ""}`}>
          <div className="inSearchWrapper">
            <div className="inSearchIcon">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="inIcon" beatFade/>
            </div>
            <input
              type="text"
              onClick={() => setIsFocused(true)}
              placeholder="Search"
              value={searchValue}
              onFocus={() => setIsFocused(true)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setSearchValue(value);
                if (value.trim() === "") {
                  onSearchResults([]);
                }}}              
              onKeyDown={handleKeyPress}
            />
            <button className="searchFilter"  onClick={handleFilterClick}>
              <FontAwesomeIcon icon={faFilter} bounce/>
            </button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {filterOptions.map((option, index) => (
                <MenuItem key={index} onClick={() => onFilterSelect(option)}>
                  <ListItemIcon>
                    {selectedFilter === option && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Menu>

            <div className={`inSearchCloseBtn ${searchValue.length >= 1 ? "inSearchCloseBtnActive" : ""}`}>
              <FontAwesomeIcon
                icon={faXmark}
                className="inIcon"
                onClick={() => {
                  setSearchValue("");
                  setIsFocused(false);
                  onSearchResults([]);
                }}
              />
            </div>
          </div>
        
        </div>
        <div className="inNavRightOptions">
          <div className="mobileSearchBtn" onClick={() => setSearchPanel(true)}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
          <div className="userProfile">
          <div
              className="userImage"
              onClick={() => setProfileMenu(!ProfileMenu)}
            >
              <img
                src={user?.imageUrl}
                alt="User Profile Pic"
              />
            </div>
            <motion.div
              className="userProfileDropdown"
              initial={{ y: 40, opacity: 0, pointerEvents: "none" }}
              animate={{
                y: !ProfileMenu ? -30 : [0, 30, 10],
                opacity: ProfileMenu ? 1 : 0,
                pointerEvents: ProfileMenu ? "auto" : "none",
                zIndex: 999999,
              }}
              transition={{ duration: 0.48 }}
            >
              <div className="profileWrapper">
                <img src={user?.imageUrl} alt="User Profile Pic" />
                <div className="profileData">
                  <button className="font-semibold text-gray-900 hover:text-[#8043cc] transition-colors duration-300" onClick={() => openUserProfile()}>{user?.firstName} {user?.lastName}</button>
                </div>
              </div>
              <div className="linksWrapper">
                <div className="link">
                  <div className="leftSide">
                    <button className="font-semibold" onClick={() => signOut({ redirectUrl: '/' })}>
                        <span className="icon">
                          <FontAwesomeIcon icon={faRightFromBracket} bounce />
                        </span>
                        Log Out
                      </button>
                  </div>
                  <span className="actionIcon">
                    <FontAwesomeIcon icon={faAngleRight} beat/>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="mobileSearchPanel"
        initial={{ y: "100vh", pointerEvents: "none", display: "none" }}
        animate={{
          display: searchPanel ? "block" : "none",
          y: searchPanel ? 0 : "100vh",
          pointerEvents: searchPanel ? "auto" : "none",
          transition: {
            bounce: 0.23,
            type: "spring",
          },
        }}
      >
        <div className="closeBtn" onClick={() => setSearchPanel(false)}>
          <FontAwesomeIcon icon={faAngleDown} bounce />
        </div>

        <div className="inMobileSearch">
          <div className="mobileSearchIcon">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="inIcon" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onKeyDown={handleKeyPress}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchValue(e.target.value)
            }
          />
          {searchValue.length >= 1 && (
            <FontAwesomeIcon
              icon={faXmark}
              className="inIcon cursor-pointer"
              onClick={() => {
                setSearchValue("");
                onSearchResults([]);
              }}
            />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
