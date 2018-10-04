import { contents, gGlif, fontinfo } from "./testufo.js";
import plist from "plist";
const xml2js = require("xml2js");
const R = require("ramda");

var parser = new xml2js.Parser({
  preserveChildrenOrder: true
  // explicitArray: false,
  // explicitChildren: true,
  // charkey: "content",
  // attrkey: "props",
  // childkey: "content",
  // emptyTag: {}
});

class UfoReader {
  getContents() {
    return plist.parse(contents);
  }
  getFontinfo() {
    return plist.parse(fontinfo);
  }
  getGlyph(filename) {
    let glyph;
    var xml = gGlif;

    let data = null,
      error = null;
    parser.parseString(xml, (fail, result) => {
      error = fail;
      data = result;
    });
    if (error) throw error;
    return data;

    // return XML.parse(xml, { preserveAttributes: true });
  }
}

class Ufo {
  state = {
    font: null
  };

  constructor() {
    this.reader = new UfoReader();
  }

  contour(data) {
    let contour = {
      _type: "contour",
      closed: true,
      points: []
    };

    data.point.forEach(point => {
      contour.points.push({
        _type: "point",
        x: R.path(["$", "x"], point),
        y: R.path(["$", "y"], point),
        type: R.path(["$", "type"], point) || "offcurve"
      });
    });

    // cycle the offcurve-points of the end to the beginning
    // because of the strange UFO-notation
    while (contour.points[contour.points.length - 1].type === "offcurve") {
      contour.points.unshift(contour.points.pop());
    }

    // now we make sure we always have a move point at the beginning
    if (contour.points[0].type !== "move") {
      // add the move point

      contour.points.unshift({
        _type: "point",
        x: contour.points[contour.points.length - 1].x,
        y: contour.points[contour.points.length - 1].y,
        type: "move"
      });
    } else {
      contour.closed = false;
    }

    return contour;
  }

  outline(data) {
    let outline = {
      _type: "outline",
      contours: []
    };

    data.contour.forEach(contour => {
      outline.contours.push(this.contour(contour));
    });

    return outline;
  }

  glyph(name, filename) {
    let glyph = {
      _type: "glyph",
      width: 0,
      height: 0,
      unicode: 0,
      outlines: []
    };

    if (!name) {
      throw `UFO glyph has no name – check contents.plist`;
    }
    glyph.name = name;

    if (!filename) {
      throw `UFO glyph has no filename – check contents.plist`;
    }

    let data = this.reader.getGlyph(filename);
    console.log("XML", data);

    // check format
    if (data.glyph.$.format !== "1") {
      throw `UFO glyph is not in format Verson 1 – ${filename}:${
        data.glyph.$.format
      }`;
    }

    glyph.width = parseFloat(
      R.path(["glyph", "advance", 0, "$", "width"], data)
    );
    glyph.height = parseFloat(
      R.path(["glyph", "advance", 0, "$", "height"], data)
    );
    glyph.unicode = R.path(["glyph", "unicode", 0, "$", "hex"], data);

    if (data.glyph.outline) {
      data.glyph.outline.forEach(outline => {
        glyph.outlines.push(this.outline(outline));
      });
    }

    return glyph;
  }

  font() {
    // now use the `parse()` and `build()` functions
    var contents = this.reader.getContents();

    let font = {
      _type: "font",
      glyphs: []
    };

    Object.keys(contents).forEach(key => {
      let item = contents[key];
      font.glyphs.push(this.glyph(key, item));
    });

    return font;
  }

  parse() {
    this.state.font = this.font();
    console.dir(this.state.font);
  }
}

export default Ufo;
