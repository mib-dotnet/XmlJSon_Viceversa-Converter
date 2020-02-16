function transform() {
  var inputXml = parseToXmlDoc(document.getElementById('xmltext').value);
  var json = convertXmlToJson2(inputXml);

  document.getElementById('jsontext').innerHTML = '<pre>' + JSON.stringify(json, null, 4) + '</pre>';
  // document.getElementById("jsontext").innerHTML = json;

}
