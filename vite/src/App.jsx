import Header from "./Header/Header";
import Login from "./SigninANDout/Login";
import Signin from "./SigninANDout/Signin";
import Main from "./Main/Main";
import { Routes, Route,useLocation } from "react-router-dom";
import ModelForm from "./Models/model";
import AddModel from "./Models/create";
import Chat from "./Chat/chat";
import MyModels from "./Models/Mymodels";
import AudioUploader from "./Voice/Voice";
import TalkWithPersonalities from "./Voice/Talk";
import { useState } from "react";
import Footer from "./Footer/Footer";
import Msg from "./Example/exp";
import Test from "./Test/Test";
import UserChat from "./Code/ChatUI";
import ChatLayout from "./Example/exp";
import Feedback from "./Feedback/feedback";
import Comunity from "./community/comunity";
import Allcumminty from "./community/allcumminty";
import { AnimatePresence } from "framer-motion";
import Summurizer from "./Test/Summurizer";
import Collegematch from "./college Finder/collegematch";
import WorldMap from "./college Finder/map";
import Favourite from "./college Finder/favourite";
import Header_chat from "./Chat/header_chat";
import Chat_text from "./Chat/chat_text";
import CHAT from "./Chat/chat";

function App() {
  // fixed naming: personality + setPersonality
  const [personality, setPersonality] = useState("Einstein");

  return (
    <>
      <Header/>
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Main />
              <AddModel />
              <Favourite/>
              <Footer />
            </>
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signin />} />

        {/* Models */}
        <Route path="/createmodel" element={<ModelForm />} />
        <Route path="/chat/:modelId" element={<CHAT/>} />
        <Route
          path="/chatModels"
          element={
            <>
              <AddModel />
              <MyModels />
            </>
          }
        />

        {/* Personality Voice Chat */}
        <Route
          path="/aivoice"
          element={<TalkWithPersonalities setPersonality={setPersonality} />}
          // element={<TalkWith setPersonality={setPersonality} />}
        />
        <Route
          path="/personalityChat"
          element={<AudioUploader personality={personality} />}
        />

        {/* Quick Test */}
        <Route path="/quicktest" element={<Test />} />

        <Route
          path="/exp"
          element={
            <>
              <ChatLayout/>
            </>
          }
        />

        <Route path="/userchat/:uid" element={<CHAT/>} />

        <Route path="/feedback" element={<><Feedback/><Footer /></>} />

        <Route path="/community" element={<Comunity/>}  />
        <Route path="/com" element={<Allcumminty/>}  />


        <Route path="/sum" element={<Summurizer/>} />

        <Route path="/college" element={<Collegematch/>} />
        <Route path="/map" element={<WorldMap/>} />



       </Routes>
       </AnimatePresence>
      {/* <Footer /> */}

    </>
  );
}

export default App;
