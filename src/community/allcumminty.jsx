import { collection, getDoc, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";

export default function Allcumminty() {
  const navigate = useNavigate();
  const [communities,setcommunities]=useState([])

  const navigater = async () => {
    navigate("/community");
  };

  const get_all_cumminity = async () => {
    const reference = collection(db, "Community");
    const data = await getDocs(reference);
    setcommunities(data)
    data.map((doc) => {
      console.log(doc.id, doc.data()); // doc.data() works here
    });
  };

  get_all_cumminity();
  return (
    <div>
      <h1>INlist a community </h1>
      <button onClick={navigater}>Enter the cumminty</button>

      <br />
      <br />

      <div>
        <h1>All communities</h1>

        <ol>
            {/* {communities.forEach((doc)=>{
                <li>{doc.data()}</li>
            })} */}
        </ol>
      </div>
    </div>
  );
}
