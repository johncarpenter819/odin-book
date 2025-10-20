import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserProfile } from "../api/api";

const UserSearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setError("Please enter a username to search");
      return;
    }

    const findAndRedirect = async () => {
      try {
        const profileData = await getUserProfile(query);

        if (profileData && profileData.username) {
          navigate(`/profile/${profileData.username}`, { replace: true });
        } else {
          setError(`No user found with the username: ${query}`);
          setLoading(false);
        }
      } catch (e) {
        console.error("User search failed:", e);
        setError(`Failed to find user "${query}".`);
        setLoading(false);
      }
    };
    findAndRedirect();
  }, [query, navigate]);

  if (loading)
    return <div className="search-loading">Searching for {query}...</div>;
  if (error) return <div className="search-error">{error}</div>;

  return null;
};

export default UserSearchPage;
