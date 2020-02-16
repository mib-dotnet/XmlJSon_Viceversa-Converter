var DOMNodeTypes = {
    ELEMENT_NODE 	   : 1,
    TEXT_NODE    	   : 3,
    CDATA_SECTION_NODE : 4,
    COMMENT_NODE	   : 8,
    DOCUMENT_NODE 	   : 9
};


function parseToXmlDoc(xmlString){
    var xmlDoc;

    //1. parse the xmlstring & convert to xmlDoc
    //For Non-IE
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlString, "text/xml");
    }
    else //For IE
    {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlString);
    }

    return xmlDoc;
}

function isValidXml(xmlDoc){
    var documentElement = (xmlDoc ? xmlDoc.ownerDocument || xmlDoc : 0).documentElement;

    return documentElement ? documentElement.nodeName.toLowerCase() !== 'html' : false;
}

function getAttributeValues(node){
    var attributes = node.attributes,
    
    obj = {};

    // If the node has attributes, assign the new object properties
    // corresponding to each attribute
    if (node.hasAttributes()) {
      for (var i = 0; i < attributes.length; i++) {
        obj["_"+attributes[i].name] = getNodeValueByType(attributes[i].value);
      }
    }

    // return the new object
    return obj;
}

function getNodeValueByType(nodeValue){
    var num = Number(nodeValue);

    // If the value is 'true' or 'false', parse it as a Boolean and return it
    if (nodeValue.toLowerCase() === 'true' || nodeValue.toLowerCase() === 'false') {
      return (nodeValue.toLowerCase() == 'true');
    }

    // If the num parsed to a Number, return the numeric value
    // Else if the valuse passed has no length (an attribute without value) return null,
    // Else return the param as is
    return (isNaN(num)) ? nodeValue.trim() : (nodeValue.length == 0) ? null : num;
}

function getNodeChildren(rootObject, childNodes){
    if (childNodes.length > 0) {
        // Loop over all the child nodes
        for (var i = 0; i < childNodes.length; i++) {
          // If the child node is a XMLNode, parse the node
          if (childNodes[i].nodeType == 1) {
            getNodeObject(rootObject, childNodes[i]);
          }
        }
    }

    return rootObject;
}

function getNodeObject(rootObject, currentNode){
    
    attributeValues=getAttributeValues(currentNode);

    // If there is only one text child node, there is no need to process the children
    if (currentNode.childNodes.length == 1 && currentNode.childNodes[0].nodeType == 3) {
        // If the node has attributes, then the object will already have properties.
        // Add a new property 'text' with the value of the text content
        if (currentNode.hasAttributes()) {
            attributeValues['text'] = getNodeValueByType(currentNode.childNodes[0].nodeValue);
        }
        // If there are no attributes, then the parent[nodeName] property value is
        // simply the interpreted textual content
        else {
            attributeValues = getNodeValueByType(currentNode.childNodes[0].nodeValue);
        }
    }
    // Otherwise, there are child XMLNode elements, so process them
    else {
        attributeValues = getNodeChildren(attributeValues, currentNode.childNodes);
    }

    // If this is the first or only instance of the node name, assign it as
    // an object on the parent.
    if (!rootObject[currentNode.nodeName]) {
        rootObject[currentNode.nodeName] = attributeValues;
    }
      // Else the parent knows about other nodes of the same name
    else {
        // If the parent has a property with the node name, but it is not an array,
        // store the contents of that property, convert the property to an array, and
        // assign what was formerly an object on the parent to the first member of the
        // array
        if (!Array.isArray(rootObject[currentNode.nodeName])) {
            var tmp = rootObject[currentNode.nodeName];
            rootObject[currentNode.nodeName] = [];
            rootObject[currentNode.nodeName].push(tmp);
        }

        // Push the current object to the collection
        rootObject[currentNode.nodeName].push(attributeValues);
    }

    return rootObject;

}


/**
* Converts xml to Json by Recursion
*
* @method convertXmlToJson1
* @param {xmlDoc} xmlDocument to be processed
* @returns json string
*/
function convertXmlToJson1(xmlDoc){

    if(!isValidXml(xmlDoc))
        return {'Error':'Invalid Xml'};    
    
    // documentElement always represents the root node
    var xmlChildNodes = xmlDoc.nodeType==DOMNodeTypes.DOCUMENT_NODE? [...xmlDoc.documentElement.children]:xmlDoc.nodeType==DOMNodeTypes.ELEMENT_NODE?[...xmlDoc.children]:[...xmlDoc.children];

    // var txt = "";

    // var i, j = 0;
    
    // for (i = 0; i < xmlChildNodes.length ;i++) {

    //     for (j = 0; j < xmlChildNodes[i].children.length ;j++) {

    //         txt += xmlChildNodes[i].children[j].nodeName + ": " + xmlChildNodes[i].children[j].innerHTML + "<br>";
    //     }

    //     txt += "<br/>"
    // }

    // return txt;

    // initializing object to be returned. 
    let jsonResult = {};

    for (let child of xmlChildNodes) {

        // checking is child has siblings of same name. 
        let childIsArray = xmlChildNodes.filter(eachChild => eachChild.nodeName === child.nodeName).length > 1;

        // if child is array, save the values as array, else as strings. 
        if (childIsArray) {
            if (jsonResult[child.nodeName] === undefined) {
                jsonResult[child.nodeName] = [convertXmlToJson1(child)];
            } else {
                jsonResult[child.nodeName].push(convertXmlToJson1(child));
            }
        } else {
        jsonResult[child.nodeName] = convertXmlToJson1(child);
        }
    }

    return jsonResult;


}

function convertXmlToJson2(xmlDoc){

    if(!isValidXml(xmlDoc))
        return {'Error':'Invalid Xml'};

    var jsonResult = getNodeObject({}, xmlDoc.firstChild);

    return jsonResult;
}
    
