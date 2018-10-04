import React, { Component, Fragment } from "react";

import "./styles.css";

let size = 10;

let renderPoint = point => {
  let { x, y, label } = point;
  let scale = 1;

  switch (point.type) {
    case "move":
      return (
        <circle
          className="Point--path"
          cx={x}
          cy={y}
          r={(size / 2) * scale * 3}
        />
      );

      break;
    case "offcurve":
      return (
        <circle className="Point--path" cx={x} cy={y} r={(size / 2) * scale} />
      );

      break;
    case "curve":
      return (
        <rect
          className="Point--path"
          x={x - (size * scale) / 2}
          y={y - (size * scale) / 2}
          width={size * scale}
          height={size * scale}
        />
      );

      break;
    case "line":
      return (
        <rect
          className="Point--path"
          x={x - (size * scale) / 2}
          y={y - (size * scale) / 2}
          width={size * scale}
          height={size * scale}
        />
      );

      break;
    default:
      throw new Error(`render error of point-type: ${point.type}`);
  }
};

class Point extends Component {
  render() {
    let { point } = this.props;
    return <Fragment>{renderPoint(point)}</Fragment>;
  }
}

export default Point;
