import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { db, storage, auth } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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

const initialState = {
  name: "",
  email: "",
};

const Album = () => {
  const newLocal = auth.currentUser.uid;
  console.log(newLocal)
  const [data, setData] = useState(initialState);
  const { name, email } = data;
  // const [file, setFile] = useState(null);
  // const [progress, SetProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, "users", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };
  
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "Name is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    
    console.log(newLocal);
    if (true) {
      try {
        // await ref("users").child(auth().currentUser.uid)
        
          
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await updateDoc(doc(db, "users", id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }

    navigate("/users");
  };
  return (
    <div>
      <Grid
        centered
        verticalAlign="middle"
        columns="3"
        style={{ height: "80vh" }}
      >
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit ? (
                <Loader active inline="center" size="huge" />
              ) : (
                <>
                  <h2>{ "Add Album"}</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="Name"
                      error={errors.name ? { content: errors.name } : null}
                      placeholder=" Enter Name"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      autoFocus
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
