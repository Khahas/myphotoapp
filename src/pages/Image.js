import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { db, storage, auth } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

const Image = () => {
  const [data, setData] = useState();
  const [file, setFile] = useState(null);
  const [progress, SetProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  
  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          SetProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("upload is Paused");
              break;
            case "running":
              console.log("upload is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if (!id) {
      try {
        await addDoc(collection(db, "Sunnybeach2021"), {
          ...data,
          timestamp: serverTimestamp(),

          userId: auth.currentUser.uid,
        });
      } catch (error) {
        console.log(error);
      }
    } 

    navigate("/");
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
                  <h2>Add Image</h2>
                  <Form onSubmit={handleSubmit}>
                   
                    <Form.Input
                      label="Upload"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                      primary
                      type="submit"
                      disabled={progress !== null && progress < 100}
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

export default Image;
