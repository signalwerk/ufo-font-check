import React, { Component, Fragment } from "react";
import Points from "../Points";
import Segments from "../Segments";
import "./styles.css";

let contourToSvg = contour => {
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
        throw new Error(`render error of point-type: ${point.type}`);
    }
  });

  if (contour.closed) {
    path.push(`Z`);
  }

  return path.join(" ");
};

export const ContourToSvg = contourToSvg;

class Outline extends Component {
  render() {
    let { outline } = this.props;
    return (
      <Fragment>
        <path
          className="Outline--fill"
          d={outline.contours.map(contour => contourToSvg(contour)).join(" ")}
        />

        <g>
          {outline.contours.map((contour, index) => (
            <Fragment>
              <g>
                <Segments points={contour.points} />
              </g>
            </Fragment>
          ))}
        </g>

        {/*
          */}
        <path
          className="Outline--path"
          d={outline.contours.map(contour => contourToSvg(contour)).join(" ")}
        />

        <g>
          {outline.contours.map((contour, index) => (
            <Fragment>
              <g>
                <Points points={contour.points} label={`${index}`} />
              </g>
            </Fragment>
          ))}
        </g>
      </Fragment>
    );
  }
}

export default Outline;
