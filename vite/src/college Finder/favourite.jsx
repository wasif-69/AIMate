import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/firebaseConfig";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import "./favourite.css";

const PAGE_SIZE = 6;

export default function Favourite() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [refreshToggle, setRefreshToggle] = useState(false); // to refresh list on delete

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const favCollection = collection(db, "Student", user.uid, "Favourite");
        let q = query(favCollection, orderBy("university"), limit(PAGE_SIZE));

        if (lastDoc && page > 1) {
          q = query(favCollection, orderBy("university"), startAfter(lastDoc), limit(PAGE_SIZE));
        }

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(data);

        // Save last document for pagination
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, page, refreshToggle]);

  // Remove a favorite university
  const removeFavorite = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "Student", user.uid, "Favourite", id));
      // Trigger refresh by toggling refreshToggle
      setRefreshToggle(!refreshToggle);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) return <p>Loading your favorites...</p>;

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Please log in to see your favorite universities.</h2>
      </div>
    );
  }

  return (
    <div className="favourites-container">
      <h2 style={{ textAlign: "center", color: "#1976d2" }}>
        🎓 Your Favorite Universities
      </h2>

      {favorites.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          You haven't marked any universities as favorite yet.
        </p>
      ) : (
        <>
          <div className="favorite-grid">
            {favorites.map((uni) => (
              <div key={uni.id} className="favorite-card">
                <h3>{uni.university}</h3>
                <p><strong>QS Ranking:</strong> {uni.Qs_ranking}</p>
                <p><strong>Acceptance Rate:</strong> {uni.acceptance_rate}</p>
                <p><strong>Application Deadline:</strong> {uni.deadline}</p>
                <p><strong>Scholarship:</strong> {uni.scholarship}</p>
                <p><strong>Location:</strong> {uni.location}</p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={uni.website} target="_blank" rel="noopener noreferrer">
                    {uni.website}
                  </a>
                </p>
                <button
                  className="remove-btn"
                  onClick={() => removeFavorite(uni.id)}
                >
                  Remove from Favorites
                </button>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              disabled={favorites.length < PAGE_SIZE}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
