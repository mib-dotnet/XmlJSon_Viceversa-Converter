function transform2Json() {
  var inputXml = parseToXmlDoc(document.getElementById('xmltext').value);
  var json = convertXmlToJson2(inputXml);

  document.getElementById('jsontext').innerHTML = '<pre>' + JSON.stringify(json, null, 4) + '</pre>';
  // document.getElementById("jsontext").innerHTML = json;

}

function transform2Xml() {
  var inputJson = document.getElementById('xmltext').value;
  var xml = convertJsonToXml(JSON.parse(inputJson));
  var xmlForHtml = document.createTextNode(xml);
  document.getElementById('jsontext').append(xmlForHtml);
  // document.getElementById("jsontext").innerHTML = json;

}
