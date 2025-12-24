import React from "react";
import NewsFeed from "../Pages/NewsFeed";

const TrendingNews = () => {
  return <NewsFeed category="general" pageSize={50}/>;
};

export default TrendingNews;