import React, { Component, Fragment } from "react";

import "./styles.css";

let size = 18;

let renderPoint = point => {
  let { x, y, label } = point;
  let scale = 1;

  switch (point.type) {
    case "move":
      return (
        <circle
          className="Point--path Point--path-move"
          cx={x}
          cy={y}
          r={(size / 2) * scale * 3}
        />
      );

      break;
    case "offcurve":
      return (
        <circle
          className="Point--path Point--path-offcurve"
          cx={x}
          cy={y}
          r={(size / 2) * scale}
        />
      );

      break;
    case "curve":
      return (
        <rect
          className="Point--path Point--path-curve"
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

let getItem = (arr, i) => {
  let index = parseInt(i);

  return index < 0 ? arr[arr.length + index] : arr[index];
};

let renderPoints = (points, label) => {
  let all = [];
  let tangents = [];

  points.forEach((point, index) => {
    if (point.type === "curve") {
      let lastPoint = getItem(points, index - 1);
      let secondLastPoint = getItem(points, index - 2);
      let thirdLastPoint = getItem(points, index - 3);

      tangents.push(
        <g>
          <path
            className="Points--handels"
            d={`M${lastPoint.x} ${lastPoint.y}, L${point.x} ${point.y}`}
          />
          <path
            className="Points--handels"
            d={`M${thirdLastPoint.x} ${thirdLastPoint.y}, L${
              secondLastPoint.x
            } ${secondLastPoint.y}`}
          />
        </g>
      );
    }

    if (point.type === "move") {
      all.push(
        <g
          transform={`translate(${point.x}, ${point.y}) scale(1, -1) `}
          x={0}
          y={0}
        >
          <circle className="contour--text-bg" cx={32} cy={-29} r={23} />

          <text
            textAnchor="middle"
            x={32}
            y={-15}
            className="contour--text"
          >{`${label}`}</text>
        </g>
      );
    }

    all.push(<Point point={point} />);
  });

  return [...tangents, ...all];
};

class Points extends Component {
  render() {
    let { points, label } = this.props;
    return <Fragment>{renderPoints(points, label)}</Fragment>;
  }
}

export default Points;
