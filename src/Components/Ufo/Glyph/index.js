import React, { Component } from "react";

import Outline from "../Outline";

import "./styles.css";

let yViewport = 1000;

class Glyph extends Component {
  render() {
    let { glyph, fontinfo } = this.props;

    let upm = fontinfo.upm;
    let maxHeight = fontinfo.ascender + Math.abs(fontinfo.descender);
    let midOffset = 0 - (maxHeight / 2 - fontinfo.ascender); // offset baseline middle maxHeight
    let scale = (upm / yViewport) * 0.8;

    let yOffset =
      yViewport * 0.8 -
      (maxHeight * 0.8) / 2 +
      midOffset * 0.8 +
      yViewport * 0.1;
    let xOffset = yViewport * 0.1;

    return (
      <div className="Glyph--root">

        <svg className="Glyph--svg" viewBox={`0 0 ${upm} ${upm}`}>
          {/*
            */}

          <rect className="upm" width={upm} height={upm} />

          <g
            transform={`scale(1, -1) translate(${xOffset} ${0 - yOffset})`}
            x="0"
            y="0"
          >
            <g transform={`scale(${scale} ${scale})`} x="0" y="0">
              {/*
          <rect  className="upm" width={upm} height={upm} />
              <rect
                className="upm"
                x="0"
                y={fontinfo.descender}
                width={upm}
                height={maxHeight}
              />
              */}

              <path
                className="left"
                d={`M0 ${fontinfo.descender}, L0 ${fontinfo.ascender}`}
                fill="none"
              />

              <path
                className="right"
                d={`M${glyph.width} ${fontinfo.descender}, L${glyph.width} ${
                  fontinfo.ascender
                }`}
                fill="none"
              />

              <path
                className="ascender"
                d={`M0 ${fontinfo.ascender}, L${glyph.width} ${
                  fontinfo.ascender
                }`}
                fill="none"
              />

              <path
                className="capheight"
                d={`M0 ${fontinfo.capHeight}, L${glyph.width} ${
                  fontinfo.capHeight
                }`}
                fill="none"
              />

              <path
                className="descender"
                d={`M0 ${fontinfo.descender}, L${glyph.width} ${
                  fontinfo.descender
                }`}
                fill="none"
              />
              <path
                className="xheight"
                d={`M0 ${fontinfo.xHeight}, L${glyph.width} ${
                  fontinfo.xHeight
                }`}
                fill="none"
              />

              <path
                className="baseline"
                d={`M0 0, L${glyph.width} 0`}
                fill="none"
              />

              {glyph.outlines.map(outline => (
                <Outline key={outline.id} outline={outline} />
              ))}
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

export default Glyph;
