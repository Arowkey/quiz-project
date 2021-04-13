function loadXMLfromFile(file, handler) {
    var reader = new FileReader();
    reader.onload = function (e) {
        let parser = new DOMParser();
        let xmlDoc =  parser.parseFromString(reader.result, 'application/xml');
        handler(xmlDoc);
    };
    reader.readAsText(file);
}