class UfoFilename {
  // http://unifiedfontobject.org/versions/ufo3/conventions.html#usernametofilename
  // get/set methods:
  fileName(filename) {
    let userName = filename;
    userName = userName.replace(/^\./, "_");

    userName = userName.replace(/[A-Z]/g, match => match + "_");

    userName = userName.replace(
      /(CON|PRN|AUX|CLOCK\$|NUL|A:-Z:|COM1|LPT1|LPT2|LPT3|COM2|COM3|COM4)/i,
      "_$1"
    );

    return userName;
  }

  // try to reconstruct the name
  fileNameReconstruction(filename) {
    let baseName = filename;
    baseName = baseName.replace(/([a-z]_)/g, match =>
      match.toUpperCase().replace("_", "")
    );

    return baseName;
  }
}

export default UfoFilename;
