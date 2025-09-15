import Header from './Header/Header';
import Login from './SigninANDout/Login';
import Signin from './SigninANDout/Signin';
import Main from './Main/Main'
import { Routes, Route, Link,BrowserRouter } from 'react-router-dom';
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

  const [personality,setpersonaity]=useState("Enistein")

  return (
    <>
    <Header/>
    
     <Routes>
        <Route path="/" element={
          <>
          <Main/>
          <AddModel/>
          <TalkWithPersonalities setpersonaity={setpersonaity}/>
          </>
        } />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signin/>} />
        <Route path='/createmodel' element={<><ModelForm/></>}/>
        <Route path="/chat/:modelId" element={<Chat />} />

        <Route path="/chatModels" element={
          <>
          <AddModel></AddModel>
          <MyModels></MyModels>
          
          </>
        }/>

        <Route path='/aivoice' element={
          <>
          <TalkWithPersonalities></TalkWithPersonalities>
          </>
        }/>
        <Route path="/personalityChat" element={<AudioUploader  personality={personality}/>} />

        <Route path='/quicktest'  element={<Test/>}/>

      </Routes>
      <Footer/>
      </>
  )
}

export default App
