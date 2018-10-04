import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Drop from "./Components/Drop";
import Glyph from "./Components/Ufo/Glyph";

import UFO from "./lib/ufo";

class App extends Component {
  onClick(e) {
    console.log("-- start");
    let ufo = new UFO();
    ufo.parse();
  }

  render() {
    let ufo = new UFO();
    ufo.parse();
    let glyph = ufo.state.font.glyphs[0];
    console.log("-- glyph", glyph);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <button onClick={e => this.onClick(e)}>RUN</button>
          To get started, edit <code>src/App.js</code> and save to reload.
          <Drop />
          <Glyph glyph={glyph} />
        </p>
      </div>
    );
  }
}

export default App;
