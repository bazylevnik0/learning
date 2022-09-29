import React from "react";
import * as Tone from "tone";
import Help from "./Help";

function Nav(props) {
  let [speed, setSpeed] = React.useState("1000");
  function play() {
    props.data.map((el, index) => {
      let temp = el.split("%");
      temp = temp.slice(1);
      for (let i = 0; i < temp.length; i++) {
        let note = temp[i].slice(0, 2);
        let time = temp[i].slice(3) + "n";
        setTimeout(
          () =>
            new Tone.Synth().toDestination().triggerAttackRelease(note, time),
          i * +speed
        );
      }
    });
  }
  function speedChange(event) {
    setSpeed(event.target.value);
  }
  let [helpState, setHelpState] = React.useState("none");
  function callHelp() {
    if (helpState === "none") setHelpState("block");
    else setHelpState("none");
  }
  return (
    <nav>
      <p id="play" onClick={play}>
        ▶️
      </p>
      <input id="speed" type="text" onChange={speedChange} placeholder="1000" />
      <p id="help-button" onClick={callHelp}>
        ❔
      </p>
      <h1>listenit</h1>
      <div className="help-div " style={{ display: helpState }}>
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
    </nav>
  );
}

export default Nav;
