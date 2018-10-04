import React, { Component, Fragment } from "react";

import { ContourToSvg } from "../Outline";

import "./styles.css";

let size = 10;

let getItem = (arr, i) => {
  let index = parseInt(i);

  return index < 0 ? arr[arr.length + index] : arr[index];
};

let renderSegments = points => {
  let segments = [];
  let pts = [];

  points.forEach((point, index) => {
    switch (point.type) {
      case "curve":
        segments.push(
          <path
            className="Segment--path Segment--path-curve"
            d={ContourToSvg({
              points: [
                { ...getItem(points, index - 3), type: "move" },
                getItem(points, index - 2),
                getItem(points, index - 1),
                point
              ]
            })}
          />
        );

        break;
      case "line":
        segments.push(
          <path
            className="Segment--path Segment--path-line"
            d={ContourToSvg({
              points: [{ ...getItem(points, index - 1), type: "move" }, point]
            })}
          />
        );

        break;
    }
  });

  return segments;
};

class Segments extends Component {
  render() {
    let { points } = this.props;
    console.log("render segments");
    return <Fragment>{renderSegments(points)}</Fragment>;
  }
}

export default Segments;
