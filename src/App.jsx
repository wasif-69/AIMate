import Header from './Header/Header';
import Login from './SigninANDout/Login';
import Signin from './SigninANDout/Signin';
import Main from './Main/Main';
import { Routes, Route } from 'react-router-dom';
import ModelForm from './Models/model';
import AddModel from './Models/create';
import Chat from './Chat/chat';
import MyModels from './Models/Mymodels';
import AudioUploader from './Voice/Voice';
import TalkWithPersonalities from './Voice/Talk';
import { useState } from 'react';
import Footer from './Footer/Footer';
import Msg from './Example/exp';
import Test from './Test/Test';

function App() {
  // fixed naming: personality + setPersonality
  const [personality, setPersonality] = useState("Einstein");

  return (
    <>
      <Header />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Main />
              <AddModel />
              <TalkWithPersonalities setPersonality={setPersonality} />
            </>
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signin />} />

        {/* Models */}
        <Route path="/createmodel" element={<ModelForm />} />
        <Route path="/chat/:modelId" element={<Chat />} />
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
        />
        <Route
          path="/personalityChat"
          element={<AudioUploader personality={personality} />}
        />

        {/* Quick Test */}
        <Route path="/quicktest" element={<Test />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
