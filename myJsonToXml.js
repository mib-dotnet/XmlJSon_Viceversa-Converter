function toXML(tag, o) {
    var doc = '<' + tag;
    if (typeof o === 'undefined' || o === null) {
        doc += '/>';
        return doc;
    }
    if (typeof o !== 'object') {
        doc += '>' + safeXMLValue(o) + '</' + tag + '>';
        return doc;
    }
    if (o.constructor == Object) {
        for (var a in o) {
            //get attributes
            if (a.charAt(0) == '_') {
                if (typeof o[a] !== 'object') {
                    doc += ' ' + a.substring(1) + '="' + o[a] + '"';
                    delete o[a];
                } else {
                    throw new Error((typeof o[a])
                            + ' being attribute is not supported.');
                }
            }
        }
        if (Array.isArray(Object.keys(o)) && o[a].length === 0) {
            doc += '/>';
            return doc;
        } else {
            doc += '>';
        }
        if (typeof o['#text'] !== 'undefined') {
            if (typeof o['#text'] !== 'object') {
                doc += o['#text'] + '</' + tag + '>';
                return doc;
            } else {
                throw new Error((typeof o['#text'])
                        + ' being #text is not supported.');
            }
        } else {
            for (var b in o) {
                if (o[b].constructor == Array) {
                    for (var i = 0; i < o[b].length; i++) {
                        if (typeof o[b][i] !== 'object'
                                || o[b][i].constructor == Object) {
                            doc += toXML(b, o[b][i]);
                        } else {
                            throw new Error((typeof o[b][i])
                                    + ' is not supported.');
                        }
                    }
                } else if (o[b].constructor == Object
                        || typeof o[b] !== 'object') {
                    doc += toXML(b, o[b]);
                } else {
                    throw new Error((typeof o[b]) + ' is not supported.');
                }
            }
        }
        doc += '</' + tag + '>'
        return doc;
    }
}

function safeXMLValue(value) {
    var s = value.toString();
    s = s.replace('/\&/g', '&amp;');
    s = s.replace('/\"/g', '&quot;');
    s = s.replace('/</g', '&lt;');
    s = s.replace('/>/g', '&gt;');
    return s;
}


/**
* Converts xml to Json by Recursion
*
* @method convertJsonToXml
* @param {xmlDoc} xmlDocument to be processed
* @returns json string
*/
function convertJsonToXml(jsonObj){

    if(!jsonObj || typeof jsonObj !== 'object' || jsonObj.constructor !== Object)
        return {'Error':'Invalid json'};

        for (var prop in jsonObj) {
			return toXML(prop, jsonObj[prop]);
		}
    
}