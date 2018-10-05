import React, { Component } from "react";
import "./App.css";
import Preview from "./Components/Preview";

import { contents, gGlif, fontinfo } from "./lib/ufo/testufo.js";

import UFO from "./lib/ufo";

class UfoReader {
  async getContents() {
    return contents;
  }
  async getFontinfo() {
    return fontinfo;
  }
  async getGlyph(filename) {
    return gGlif;
    // return XML.parse(xml, { preserveAttributes: true });
  }
}

let reader = new UfoReader();

class App extends Component {
  constructor() {
    super();
    this.load();
  }

  async load(files) {
    let ufo = new UFO(reader);
    await ufo.parse();
    let glyph = ufo.state.font.glyphs[0];
    let fontinfo = ufo.state.font.fontinfo;

    this.setState({
      glyph,
      fontinfo
    });
  }

  render() {
    if(!this.state) {
      return null
    }
    let { glyph, fontinfo } = this.state;
    if (!glyph || !fontinfo) {
      return null;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">UFO Check</h1>
          <h3 className="">Stefan Huber</h3>
        </header>
        <div className="App-preview">
        <Preview />
        </div>
        {/*
        <Glyph glyph={glyph} fontinfo={fontinfo} />
        */}
      </div>
    );
  }
}

export default App;
