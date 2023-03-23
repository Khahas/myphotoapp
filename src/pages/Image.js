import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { db, storage, auth } from "../firebase";
import { useParams } from "react-router-dom";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadBytes,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const Image = () => {
  const [data, setData] = useState();
  const [file, setFile] = useState(null);
  const [progress, SetProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { albumId } = useParams();
  const imagesCollection = collection(db, "images");
  const [url, setUrl] = useState(null);

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

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      setIsSubmit(true);
      let imgUrl = undefined;
      const storageRef = ref(storage, `images/${uuidv4()}_${file.name}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          setUrl(url);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    uploadImage(event.target.image.files[0]).then((url) => {
      setIsSubmit(true);

      if (true) {
        try {
          (async () => {
            await addDoc(imagesCollection, {
              // title: title,
              url: url,
              album_id: albumId,
            });
            console.log("Image added successfully !!", url);
            alert("Image added successfully !!");
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
      <Grid centered verticalAlign="middle" columns="3">
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
                      // onChange={(e) => setFile(e.target.files[0])}
                      name="image"
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
