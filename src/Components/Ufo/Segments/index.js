import React, { Component, Fragment } from "react";

import { ContourToSvg } from "../Outline";

import "./styles.css";

let getItem = (arr, i) => {
  let index = parseInt(i, 10);

  return index < 0 ? arr[arr.length + index] : arr[index];
};

let renderSegments = points => {
  let segments = [];

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
      default:
        console.log("problem?");
      // throw new Error(`render error of point-type: ${point.type}`);
    }
  });

  return segments;
};

class Segments extends Component {
  render() {
    let { points } = this.props;
    return <Fragment>{renderSegments(points)}</Fragment>;
  }
}

export default Segments;
