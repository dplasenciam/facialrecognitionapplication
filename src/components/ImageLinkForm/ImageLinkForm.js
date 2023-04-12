import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="f3 black b">
        {"This Magic Brain will detect faces in your pictures. Give it a try!"}
      </p>
      <div className="center">
        <div className="pa4 br3 shadow-5 form center">
          <input
            type="text"
            className="f4 pa2 w-70"
            onChange={onInputChange}
            onKeyPress={onButtonSubmit}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple on"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
