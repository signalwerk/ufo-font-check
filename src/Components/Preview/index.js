import React, { Component } from "react";
import Drop from "../Drop";
import Glyph from "../Ufo/Glyph";
import "./styles.css";
const uuidv4 = require("uuid/v4");

class Preview extends Component {
  constructor() {
    super();
    this.state = {
      fonts: [null, null]
    };
  }

  setFontA(font) {
    this.setState({
      fonts: [font, this.state.fonts[1]]
    });
  }
  setFontB(font) {
    this.setState({
      fonts: [this.state.fonts[0], font]
    });
  }

  getAllGlyphNames() {
    // remove dupplicates
    let names = [
      ...this.state.fonts[0].glyphs.map(g => g.name),
      ...this.state.fonts[1].glyphs.map(g => g.name)
    ];
    let unique = [...new Set(names)];
    return unique;
  }

  interpolate(valA, valB) {
    return (parseFloat(valA) + parseFloat(valB)) / 2;
  }

  renderInterpolation(fontA, fontB, name) {
    let glyphA = fontA.glyphs.find(glyph => glyph.name === name);
    let glyphB = fontB.glyphs.find(glyph => glyph.name === name);

    let glyphC = {
      error: [],
      glyph: {
        _type: "glyph",
        id: uuidv4(),
        width: 0,
        height: 0,
        unicode: 0,
        outlines: [],
        name: ""
      }
    };

    if (!glyphA || !glyphB) {
      glyphC.error.push("Glyph is not in both Fonts.");
    } else {
      if (glyphA.outlines.length !== glyphB.outlines.length) {
        glyphC.error.push("Not same amount of Outlines in glyphs");
      } else {
        glyphC.glyph.width = this.interpolate(glyphA.width, glyphB.width);

        glyphA.outlines.forEach((outlineA, indexOutline) => {
          let outlineB = glyphB.outlines[indexOutline];
          let outlineC = {
            _type: "outline",
            id: uuidv4(),
            contours: []
          };

          if (outlineA.contours.length !== outlineB.contours.length) {
            glyphC.error.push("Not same amount of contours in glyphs");
            return;
          } else {
            outlineA.contours.forEach((contourA, indexContour) => {
              let contourB = outlineB.contours[indexContour];
              let contourC = {
                _type: "contour",
                id: uuidv4(),
                closed: true,
                points: []
              };

              if (contourA.points.length !== contourB.points.length) {
                glyphC.error.push("Not same amount of points in glyphs");
                return;
              } else {
                contourA.points.forEach((pointA, indexPoint) => {
                  let pointB = contourB.points[indexPoint];
                  let pointC = {
                    _type: "point",
                    id: uuidv4(),
                    x: 0,
                    y: 0,
                    type: "offcurve"
                  };

                  if (pointA.type !== pointB.type) {
                    glyphC.error.push(
                      "Type of Points are not compatible. Check outline."
                    );
                    return;
                  } else {
                    pointC.x = this.interpolate(pointA.x, pointB.x);
                    pointC.y = this.interpolate(pointA.y, pointB.y);
                    pointC.type = pointA.type;
                    contourC.points.push(pointC);
                  }
                });
              }

              outlineC.contours.push(contourC);
            });
          }

          glyphC.glyph.outlines.push(outlineC);
        });
      }
    }

    if (glyphC.error.length > 0) {
      return (
        <div>
          <ul>{glyphC.error.map(e => <li>{e}</li>)}</ul>
        </div>
      );
    } else {
      return (
        <div>
          <Glyph glyph={glyphC.glyph} fontinfo={fontA.fontinfo} />
        </div>
      );
    }
  }

  renderByGlyphName(font, name) {
    if (font) {
      let glyph = font.glyphs.find(glyph => glyph.name === name);

      if (glyph) {
        return (
          <div>
            <Glyph glyph={glyph} fontinfo={font.fontinfo} />
          </div>
        );
      } else {
        return <div>Glyph «{name}» not available.</div>;
      }
    }
  }

  render() {
    return (
      <div className="Preview--root">
        <div className="Preview--files">
          <Drop
            label="Drop UFO A here"
            onParsed={async file => await this.setFontA(file)}
          />
          &nbsp; &nbsp;
          <Drop
            label="Drop UFO B here"
            onParsed={async file => await this.setFontB(file)}
          />
        </div>

        <div className="Preview">
          {this.state.fonts[0] &&
            this.state.fonts[1] &&
            this.getAllGlyphNames().map(glyphname => (
              <div className="Preview--glyph">
                <h3>{glyphname}</h3>
                <div className="Preview--glyphset">
                  {this.renderByGlyphName(this.state.fonts[0], glyphname)}
                  {this.renderByGlyphName(this.state.fonts[1], glyphname)}
                  {this.renderInterpolation(
                    this.state.fonts[0],
                    this.state.fonts[1],
                    glyphname
                  )}
                </div>
              </div>
            ))}
          {/*

          <Glyph glyph={glyph} fontinfo={fontinfo} />
          */}
        </div>
      </div>
    );
  }
}

export default Preview;
