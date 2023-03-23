import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { db, storage, auth } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
// import { firestore } from "firebase-admin";

const initialState = {
  title: "",
  email: "",
};

const Album = () => {
  const [userId, setUserId] = useState();
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState(undefined);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const albumsCollection = collection(db, "albums");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
    });
    return () => {
      unsub();
    };
  }, []);

  // const getSingleUser = async () => {
  //   const docRef = doc(db, "users", id);
  //   const snapshot = await getDoc(docRef);
  //   if (snapshot.exists()) {
  //     setData({ ...snapshot.data() });
  //   }
  // };

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const uploadAlbumCover = (file) => {
    return new Promise((resolve, reject) => {
      setIsSubmit(true);
      let imgUrl = undefined;
      const storageRef = ref(storage, `album_covers/${uuidv4()}_${file.name}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          setCover(url);
          console.log("image uploaded success: ", url);
          setIsSubmit(false);
          resolve(url);
        })
        .catch((error) => {
          console.error(error);
          reject();
        });
    });
  };

  const validate = () => {
    let errors = {};
    if (!title) {
      errors.title = "title is required";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    uploadAlbumCover(event.target.album_cover.files[0]).then((url) => {
      let errors = validate();
      if (Object.keys(errors).length) return setErrors(errors);
      setIsSubmit(true);

      if (true) {
        try {
          (async () => {
            console.log("cover: ", cover);
            await addDoc(albumsCollection, {
              title: title,
              cover: url,
              user_id: userId,
            });
            console.log("album added successfully !!", url);
            alert("album added successfully !!");
          })();
          setIsSubmit(false);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <div
      style={{ border: "1px black groove", padding: "10px", margin: "10px" }}
    >
      <Grid centered verticalAlign="top" columns="3" style={{ height: "100%" }}>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit ? (
                <Loader active size="huge" />
              ) : (
                <>
                  <h2>{"Add Album"}</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="title"
                      error={errors.title ? { content: errors.title } : null}
                      placeholder=" Enter title"
                      title="title"
                      value={title}
                      onChange={handleChange}
                      autoFocus
                    />

                    <Form.Input
                      type="file"
                      label="Album Cover Picture"
                      name="album_cover"
                      // error={
                      //   errors.album_cover
                      //     ? { content: errors.album_cover }
                      //     : null
                      // }
                      placeholder=" Enter title"
                      title="album_cover"
                    />

                    {/* <Form.Input
                      label="Upload"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    /> */}
                    <Button
                      primary
                      type="submit"
                      // disabled={progress !== null && progress < 100}
                    >
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Album;
