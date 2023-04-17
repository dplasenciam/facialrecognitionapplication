import React, { Component } from "react";
import ParticlesBg from "particles-bg";

import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

import "tachyons";
import "./App.css";

/*
const returnClarifaiRequestOptions = (imageUrl) => {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // In this section, we set the user authentication, user and app ID, model details, and the URL
  // of the image we want as an input. Change these strings to run your own example.
  //////////////////////////////////////////////////////////////////////////////////////////////////

  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  //const PAT = "67df80e557db4d228ed1b894282a57b4";
  const PAT = "30aa229b22df4a3cb970b6fabc7ba791";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "g29pyxsulkqc";
  const APP_ID = "DanielPlasencia-FaceDetection";
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  //const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
  //const IMAGE_URL = this.state.input;
  const IMAGE_URL = imageUrl;

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
    MODEL_ID: MODEL_ID,
  };

  return requestOptions;
};
*/

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    //const requestOptions = returnClarifaiRequestOptions(this.state.input);

    /*
      .then((data) => {
        console.log("hiiii", data);
        return data.json();
      })
      .then((data) => {
        console.log("hiii2", data);
      });*/

    /*fetch(
      "https://api.clarifai.com/v2/models/" +
        requestOptions.MODEL_ID +
        "/outputs",
      requestOptions
    )*/

    fetch("https://facialrecognition-api.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch("https://facialrecognition-api.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch((err) => {
              console.log("error", err);
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div>
        <div className="App">
          <ParticlesBg
            color="#ffffff"
            className="particles"
            type="cobweb"
            bg={true}
            num={200}
          />

          <Navigation
            onRouteChange={this.onRouteChange}
            isSignedIn={isSignedIn}
          />
          {route === "home" ? (
            <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          ) : route === "signin" ? (
            <Signin
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}
            />
          ) : (
            <Register
              onRouteChange={this.onRouteChange}
              loadUser={this.loadUser}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
