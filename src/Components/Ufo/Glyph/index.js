import React, { Component } from "react";
import "./styles.css";

let contourToSvg = contour => {
  console.log("render points", contour);

  let path = [];
  let temp = [];
  contour.points.forEach(point => {
    switch (point.type) {
      case "move":
        path.push(`M${point.x} ${point.y}`);
        break;
      case "offcurve":
        temp.push(`${point.x} ${point.y}`);
        break;
      case "curve":
        path.push(`C${temp.join(", ")}, ${point.x} ${point.y}`);
        temp = [];
        break;
      case "line":
        path.push(`L${point.x} ${point.y}`);
        temp = [];
        break;
      default:
        throw `render error of point-type: ${point.type}`;
    }
  });

  if (contour.closed) {
    path.push(`Z`);
  }

  return path.join(" ");
};

let yOffset = 500;
let xOffset = 50;
let yViewport = 1000;

class Outline extends Component {
  render() {
    let { outline } = this.props;
    console.log("render outline", outline);
    return (
      <path
        d={outline.contours.map(contour => contourToSvg(contour)).join(" ")}
      />
    );
  }
}

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

            {glyph.outlines.map(outline => <Outline outline={outline} />)}
          </g>
        </svg>
      </div>
    );
  }
}

export default Glyph;
