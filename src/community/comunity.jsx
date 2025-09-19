import React, { useState } from "react";
import {add_community} from "../Firebase/common/community"
import { auth } from "../Firebase/firebaseConfig";

export default function Comunity() {
  const [text, settext] = useState("");
  const [data,setdata]=useState({});

  const handleform = async () => {
   try{
     const response = await fetch("http://127.0.0.1:5000/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active", message: text }),
    });

    const data_get = await response.json();
    // const data_g=JSON.parse(data_get);
    console.log(data_get);
    setdata(data_get.message);
    console.log(data);
   }
   catch (e){
    console.log(e)
   }
  };

  const handle=async (e)=>{
    e.preventDefault(); // prevent reload
    const formData = new FormData(e.target); // e.target is the <form>
    const data = Object.fromEntries(formData.entries());

    try{
        await add_community(auth.currentUser.uid,data)
        alert("Value saved")
    }
    catch (e){
        alert(e)
    }

  }


  return (
    <div>
       <div>
         <h1>Hello world</h1>
      <textarea
        name="comment"
        rows="4"
        cols="50"
        onChange={(e) => {
          settext(e.target.value);
        }}
        value={text}
      >
        Enter your comment here...
      </textarea>

      <button onClick={handleform}>Summit text</button>

       </div>


      <div>
        <h1>Data representation</h1>
        <h3>Name:{data['communityType']}</h3>

        <form onSubmit={handle}>
        {data.fields?.map((field)=>{
            return(
                
            <input 
            type={field["type"]} 
            name={field["name"]}
           placeholder={`Enter ${field.name} of ${data.communityType}`}
            ></input>
            );
        })}

        <button type="submit">Summit</button>
        </form>

      </div>
    </div>
  );
}
