import React from "react";
import List from "./List";
import Nav from "./Nav";
import "../../public/styles.css";

function App() {
  //lists
  let [data, updateData] = React.useState([]);
  let [view, updateView] = React.useState(<div id="container"></div>);
  function addList() {
    let temp = data;
    temp.push("");
    updateData(temp);
    temp = view;
    updateView(
      <div id="container">
        {data.map((el, index) => {
          return (
            <List
              key={"" + index}
              id_s={"" + index}
              data={data}
              updateData={updateData}
              view={view}
              updateView={updateView}
            />
          );
        })}
      </div>
    );
  }
  //out
  return (
    <div>
      <Nav data={data} />
      {view}
      <p className="add add-list" onClick={addList}>
        ➕
      </p>
    </div>
  );
}

export default App;
