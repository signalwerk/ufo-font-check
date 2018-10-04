import React, { Component, Fragment } from "react";
import Points from "../Points";
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
        throw new Error(`render error of point-type: ${point.type}`);
    }
  });

  if (contour.closed) {
    path.push(`Z`);
  }

  return path.join(" ");
};

class Outline extends Component {
  render() {
    let { outline } = this.props;
    console.log("render outline", outline);
    return (
      <Fragment>
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
