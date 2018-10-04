import React, { Component } from "react";

import Outline from "../Outline";

import "./styles.css";

let yOffset = 500;
let xOffset = 50;
let yViewport = 1000;

class Glyph extends Component {
  render() {
    let { glyph } = this.props;
    return (
      <div className="Glyph--root">
        <svg className="Glyph--svg" viewBox={`0 0 1000 ${yViewport}`}>
          <g
            transform={`scale(1, -1) translate(${xOffset} ${0 - yOffset})`}
            x="0"
            y="0"
          >
            <path
              className="left"
              d={`M${xOffset} ${0 - yOffset}, L${xOffset} ${yViewport -
                yOffset}`}
              fill="none"
            />

            <path
              className="right"
              d={`M${xOffset + glyph.width} ${0 - yOffset}, L${xOffset +
                glyph.width} ${yViewport - yOffset}`}
              fill="none"
            />

            <path className="baseline" d={"M0 0, L1000 0"} fill="none" />

            {glyph.outlines.map(outline => (
              <Outline key={outline.id} outline={outline} />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}

export default Glyph;
