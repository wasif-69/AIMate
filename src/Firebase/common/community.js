import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import {auth,db} from "../firebaseConfig"




export const add_community=async (uid,data)=>{

    const reference=collection(db,"Community")
    
    await addDoc(reference,{
        UserID:uid,
        data:data
    })

    
}