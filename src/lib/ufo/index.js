import { contents, gGlif, fontinfo } from "./testufo.js";
import plist from "plist";
const xml2js = require("xml2js");
const R = require("ramda");
const uuidv4 = require("uuid/v4");

var parser = new xml2js.Parser({
  preserveChildrenOrder: true
  // explicitArray: false,
  // explicitChildren: true,
  // charkey: "content",
  // attrkey: "props",
  // childkey: "content",
  // emptyTag: {}
});

// class UfoReader {
//   getContents() {
//     return contents;
//   }
//   getFontinfo() {
//     return fontinfo;
//   }
//   getGlyph(filename) {
//     return gGlif;
//     // return XML.parse(xml, { preserveAttributes: true });
//   }
// }

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

class Ufo {
  state = {
    font: null
  };

  constructor(reader) {
    this.reader = reader;
  }

  getGlyph(xml) {
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

  contour(data) {
    let contour = {
      _type: "contour",
      id: uuidv4(),
      closed: true,
      points: []
    };

    data.point.forEach(point => {
      contour.points.push({
        _type: "point",
        id: uuidv4(),
        x: R.path(["$", "x"], point),
        y: R.path(["$", "y"], point),
        type: R.path(["$", "type"], point) || "offcurve"
      });
    });

    // UFO notates open path with a first move-point
    if (contour.points[0].type === "move") {
      contour.closed = false;
    }

    // move first element to the end
    if (
      contour.points[0].type === "curve" ||
      contour.points[0].type === "line"
    ) {
      contour.points.push(contour.points.shift());
    }

    // cycle the offcurve-points of the end to the beginning
    // because of the strange UFO-notation
    // while (contour.points[contour.points.length - 1].type === "offcurve") {
    //   contour.points.unshift(contour.points.pop());
    // }

    // now we make sure we always have a move point at the beginning
    if (contour.points[0].type !== "move") {
      // add the move point

      contour.points.unshift({
        _type: "point",
        id: uuidv4(),
        x: contour.points[contour.points.length - 1].x,
        y: contour.points[contour.points.length - 1].y,
        type: "move"
      });
    }

    return contour;
  }

  outline(data) {
    let outline = {
      _type: "outline",
      id: uuidv4(),
      contours: []
    };

    if (data.contour) {
      console.log("!!!push contour");
      data.contour.forEach(contour => {
        outline.contours.push(this.contour(contour));
      });
    } else {
      console.log("!!!data.contour", data.contour);
    }
    //

    return outline;
  }

  async glyph(name, filename) {
    let glyph = {
      _type: "glyph",
      id: uuidv4(),
      width: 0,
      height: 0,
      unicode: 0,
      outlines: [],
      name: ''
    };

    if (!name) {
      throw new Error(`UFO glyph has no name – check contents.plist`);
    }
    glyph.name = name;

    if (!filename) {
      throw new Error(`UFO glyph has no filename – check contents.plist`);
    }

    let data = this.getGlyph(await this.reader.getGlyph(filename));

    // check format
    if (data.glyph.$.format !== "1") {
      throw new Error(
        `UFO glyph is not in format Verson 1 – ${filename}:${
          data.glyph.$.format
        }`
      );
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

  fontinfo(data) {
    let fontinfo = {
      _type: "fontinfo",
      id: uuidv4(),
      ascender: data.ascender,
      capHeight: data.capHeight,
      copyright: data.copyright,
      descender: data.descender,
      xHeight: data.xHeight,
      upm: data.unitsPerEm
    };

    return fontinfo;
  }

  async font() {
    // now use the `parse()` and `build()` functions
    var contents = plist.parse(await this.reader.getContents());

    var fontinfo = this.fontinfo(plist.parse(await this.reader.getFontinfo()));

    let font = {
      _type: "font",
      id: uuidv4(),
      fontinfo,
      glyphs: []
    };

    await asyncForEach(Object.keys(contents), async key => {
      let item = contents[key];
      font.glyphs.push(await this.glyph(key, item));
    });

    return font;
  }

  async parse() {
    this.state.font = await this.font();
  }
}

export default Ufo;
