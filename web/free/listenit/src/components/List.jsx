import React from "react";
import Card from "./Card";

function List(props) {
  //addCard
  function addCard(event) {
    let temp = props.data;
    temp[props.id_s] += "%A1$1";
    props.updateData(temp);
    temp = props.view;
    props.updateView(
      <div id="container">
        {props.data.map((el, index) => {
          return (
            <List
              key={"" + index}
              id_s={"" + index}
              data={props.data}
              updateData={props.updateData}
              view={props.view}
              updateView={props.updateView}
            />
          );
        })}
      </div>
    );
  }
  let cards = props.data[props.id_s].split("%");
  cards = cards.slice(1);

  return (
    <div className="list">
      <div className="list-marker">"</div>
      {cards.map(function (el, index) {
        return (
          <Card
            key={index}
            id_c={index}
            id_s={props.id_s}
            data={props.data}
            updateData={props.updateData}
            note={el.slice(0, 2)}
            time={el.slice(3)}
          />
        );
      })}
      <p className="add add-card" onClick={addCard}>
        ➕
      </p>
    </div>
  );
}

export default List;
