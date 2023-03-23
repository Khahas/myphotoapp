import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  Button,
  Card,
  Container,
  Grid,
  Image,
  Checkbox,
} from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import ModalComp from "../components/ModalComp";
import Spinner from "../components/Spinner";
import { query, where, addDoc } from "firebase/firestore";
import ImageComponent from "./Image";
import { v4 as uuidv4 } from "uuid";

const ShowAlbum = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState(new Map());
  const navigate = useNavigate();
  const { albumId } = useParams();

  useEffect(() => {
    setLoading(true);
    // use albumId to query the database
    const albumsRef = collection(db, "images");
    const unsub = onSnapshot(
      query(albumsRef, where("album_id", "==", albumId)),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setImages(list);
        console.log("list: ", list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    // return the unsub function to be called when the component unmounts
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, []);
  if (loading) {
    return <Spinner />;
  }
  const handleModal = (item) => {
    setOpen(true);
    setImage(item);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure!!")) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, "images", id));
        setImages(images.filter((image) => image.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleCheckboxChange = (event, newImage) => {
    const image = selectedImages.get(newImage.id);
    if (image === undefined) {
      const newSelectedImages = new Map(selectedImages);
      newSelectedImages.set(newImage.id, newImage);
      setSelectedImages(newSelectedImages);
    } else {
      const newSelectedImages = new Map(selectedImages);
      newSelectedImages.delete(newImage.id);
      setSelectedImages(newSelectedImages);
    }
    setTimeout(() => {
      // console.log("imagesMap: ", );
    }, 1000);
  };

  function generateOneSegmentUUID() {
    const uuid = uuidv4();
    const segments = uuid.split("-");

    if (segments.length > 1) {
      return segments[0];
    }

    return uuid;
  }

  const handleCreateAlbum = async () => {
    const selectedImagesArray = Array.from(selectedImages.values());

    const albumTitle = window.prompt(
      "Please enter new album name:",
      "New Album 101"
    );

    if (selectedImagesArray.length > 0) {
      const newAlbumData = {
        cover: selectedImagesArray[0].url,
        title: albumTitle,
        user_id: auth.currentUser.uid,
      };
      try {
        const newAlbum = await addDoc(collection(db, "albums"), newAlbumData);
        const newImages = selectedImagesArray.map((image) => ({
          album_id: newAlbum.id,
          url: image.url,
        }));
        await Promise.all(
          newImages.map((newImage) =>
            addDoc(collection(db, "images"), newImage)
          )
        );
        navigate(`/`);
      } catch (error) {
        console.error("Error creating album", error);
      }
    }
  };
  return (
    <Container>
      <div>
        <ImageComponent />
      </div>
      <h2>Recently Added Images</h2>
      <Grid columns={3} stackable>
        {images &&
          images.map((item) => (
            <Grid.Column key={item.id}>
              <Card>
                <Card.Content>
                  <Image
                    src={item.url}
                    size="medium"
                    style={{
                      height: "150px",
                      width: "100%",
                    }}
                  />
                  <div style={{ position: "relative" }}>
                    <Checkbox
                      onChange={(e) => handleCheckboxChange(e, item)}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        zIndex: "1",
                      }}
                    />
                  </div>
                  <Card.Header style={{ marginTop: "10px" }}>
                    {item.title}
                  </Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    {/* <Button
                      color="red"
                      onClick={() => navigate(`/update/${item.id}`)}
                    >
                      Delete
                    </Button> */}
                    <Button color="purple" onClick={() => handleModal(item)}>
                      View
                    </Button>
                    {open && (
                      <ModalComp
                        open={open}
                        setOpen={setOpen}
                        handleDelete={handleDelete}
                        {...image}
                        img={item.url}
                      />
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
      </Grid>
      {images && images.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          <Button
            disabled={selectedImages.size <= 0}
            onClick={handleCreateAlbum}
          >
            Create new album
          </Button>
        </div>
      )}
    </Container>
  );
};
export default ShowAlbum;
