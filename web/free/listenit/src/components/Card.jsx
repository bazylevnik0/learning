import React from "react";

function Card(props) {
  function onChangeNote(event) {
    let data = props.data;
    let string = data[+props.id_s];
    string = string.split("%");
    string = string.slice(1);
    let word = string[+props.id_c];
    let note = word.slice(0, 2);
    let time = word.slice(word.indexOf("$") + 1);
    note = event.target.value.toString();
    word = note + "$" + time;
    string[+props.id_c] = word;
    data[+props.id_s] = "%" + string.join("%");
    props.updateData(data);
  }
  function onChangeTime(event) {
    let data = props.data;
    let string = data[+props.id_s];
    string = string.split("%");
    string = string.slice(1);
    let word = string[+props.id_c];
    let note = word.slice(0, 2);
    let time = word.slice(word.indexOf("$") + 1);
    time = event.target.value.toString();
    word = note + "$" + time;
    string[+props.id_c] = word;
    data[+props.id_s] = "%" + string.join("%");
    props.updateData(data);
  }

  return (
    <div className="card">
      <input onChange={onChangeNote} placeholder="🎵"></input>
      <input onChange={onChangeTime} placeholder="🕐"></input>
    </div>
  );
}

export default Card;
