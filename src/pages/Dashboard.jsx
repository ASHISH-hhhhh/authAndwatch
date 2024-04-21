import React, { useEffect } from "react";
import Header from "../components/header/Header";
import axios from "axios";
import { useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebse";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [vid, setVid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedVFB, setLikedVFB] = useState([]);
  async function getVid() {
    try {
      const videos = await axios.get("https://dummyjson.com/users");
      // console.log(videos.data.users);
      setVid(videos && videos.data.users);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getVid();
    if (user) {
      fetchLikedVFB();
    }
  }, [user]);
  // console.log(vid);

  function likedVid(singleVideo) {
    // console.log("Coder ki zindagi", singleVideo);
    // if (singleVideo) {
    //   const isLiked = likedVFB.some(
    //     (likedVDO) => likedVDO.id === singleVideo.id
    //   );

    //   const likedVideoInfoDoc = {
    //     id: singleVideo.id,
    //     name: singleVideo.maidenName,
    //   };
    //   addLikedVideoInfoDoc(likedVideoInfoDoc);
    // }
    if (singleVideo) {
      const isLiked = likedVFB.some(
        (likedVDO) => likedVDO.id === singleVideo.id
      );
      if (!isLiked) {
        const likedVideoInfoDoc = {
          id: singleVideo.id,
          name: singleVideo.maidenName,
        };
        addLikedVideoInfoDoc(likedVideoInfoDoc);
      } else {
        toast.info("Video already liked");
      }
    }
  }

  async function addLikedVideoInfoDoc(likedVideoInfoDoc) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/likedvideos`),
        likedVideoInfoDoc
      );
      // likedVideoInfoDoc.docID = docRef.id;
      // console.log("IN the beginining", likedVideoInfoDoc);
      // console.log("DocRef id", docRef.id);
      toast.success("Doc Created");
      fetchLikedVFB();
      // console.log(docRef.id);
    } catch (error) {
      console.log(error);
      toast.error("Doc not created");
    }
  }

  // useEffect(() => {
  //   console.log("use effcet called");
  //   fetchLikedVFB();
  // }, []);

  async function fetchLikedVFB() {
    // console.log(docId);
    // console.log("From FVB", docId);
    // console.log("Docref In VFB", id);
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/likedvideos`));
      // console.log("ENQY 1", q);
      const querySnapshot = await getDocs(q);
      // console.log("ENQY 2", querySnapshot);

      let tempLVFB = [];
      querySnapshot.forEach((doc) => {
        // console.log("Inside query Doc", doc.data());
        const withDocId = doc.data();
        console.log("NEW WITH COMING DOCID", withDocId);
        withDocId.documentId = doc.id;
        console.log(withDocId);
        // doc.data() is never undefined for query doc snapshots
        tempLVFB.push(withDocId);
      });
      setLikedVFB(tempLVFB);

      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }
  console.log(likedVFB);
  async function deleteLikedVideo(documentId) {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/likedvideos`, documentId));
      toast.success("Video removed  successfully");
      fetchLikedVFB(); // Fetch the updated list after deletion
    } catch (error) {
      console.error("Error removing document: ", error);
      toast.error("Failed to remove element");
    }
  }

  return (
    <>
      <Header />
      <h1>Rendering Likes</h1>
      <div
        style={{
          maxHeight: "400px",
          overflow: "scroll",
        }}
      >
        {likedVFB &&
          likedVFB.map((likedVDO) => (
            <div
              style={{
                backgroundColor: "gray",
                fontSize: "10px",
                padding: "5px",
                margin: "4px",
                borderRadius: "4px",
                maxWidth: "200px",
              }}
            >
              <p>Id:{likedVDO.id}</p>
              <p>Name:{likedVDO.name}</p>
              <p>Document Id:{likedVDO.documentId}</p>
              <button onClick={() => deleteLikedVideo(likedVDO.documentId)}>
                Delete
              </button>
            </div>
          ))}
      </div>

      <hr />
      <hr />
      <hr />
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr 1fr ",
          gridTemplateColumns: "1fr 1fr 1fr ",
        }}
      >
        {vid &&
          vid.map((singleVideo) => {
            return (
              <div
                key={singleVideo.id}
                style={{
                  border: "1px solid gray",
                  margin: "0.7rem",
                  padding: "0.7rem",
                  borderRadius: "0.6rem",
                }}
              >
                <p>ID:{singleVideo.id}</p>
                <p>First Name:{singleVideo.firstName}</p>
                <p>Middle Name:{singleVideo.maidenName}</p>
                <p>Last Name:{singleVideo.lastName}</p>

                <button onClick={() => likedVid(singleVideo)}>Like</button>
              </div>
            );
          })}
      </div>
      <hr />
    </>
  );
}

export default Dashboard;
