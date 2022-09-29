import React from "react";

function Help(props) {
  return (
    <div className={"help-div " + props.show}>
      <h2>main:</h2>
      <p> - add card/list: ➕</p>
      <p> - play ▶️ with speed of reading in ms</p>
      <h2>card:</h2>
      <p> 🎵 - octave ( format: "A1 , C4 , ...")</p>
      <p> 🕐 - duration ( format: "1 , 3 , ...") </p>
      <hr />
      <p>
        <b>if (error)</b>: smile & refresh
      </p>
    </div>
  );
}

export default Help;
