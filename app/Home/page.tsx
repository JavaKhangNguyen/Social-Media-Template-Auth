"use client";
import React, { useState } from "react";
import Post from "../components/post/Post";
import Navbar from "../components/navbar/Navbar";
import LeftSidebar from "../components/sidebar/Left";
import RightSidebar from "../components/sidebar/Right";

const Page: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchResults, setSearchResults] = useState([]);
  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  }
  const handleSearchResults = (results: []) => {
    setSearchResults(results);
  }

  return (
    <>
      <Navbar selectedFilter={selectedFilter} onFilterSelect={handleFilterSelect} onSearchResults={handleSearchResults}/>
      <div className="mainContainer">
        <LeftSidebar />
        <div className="mainSection">
          <Post selectedFilter={selectedFilter} searchResults={searchResults} />
        </div>
        <RightSidebar />
      </div>
    </>
  );
};

export default Page;
