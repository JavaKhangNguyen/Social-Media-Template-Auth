"use client";
import React, { useState } from "react";
import Post from "../components/post/Post";
import Navbar from "../components/navbar/Navbar";
import LeftSidebar from "../components/sidebar/Left";
import RightSidebar from "../components/sidebar/Right";

const Page: React.FC = () => {
  // State for managing selected filter
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // State for searching
  const [searchResults, setSearchResults] = useState([]);

  // Function to update the selected filter
  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  }

  const handleSearchResults = (results: []) => {
    setSearchResults(results);
  }

  return (
    <>
      <Navbar selectedFilter={selectedFilter} onFilterSelect={handleFilterSelect} onSearchResults={handleSearchResults}/>
      {/* Left Sidebar starts here */}
      <div className="mainContainer">
        <LeftSidebar />
        {/* Left Sidebar ends here */}

        <div className="mainSection">
          {/* Posts section*/}
          <Post selectedFilter={selectedFilter} searchResults={searchResults} />
        </div>
        {/* Right sidebar*/}
        <RightSidebar />
      </div>
    </>
  );
};

export default Page;
