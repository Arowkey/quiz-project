const btnSave = document.getElementById('save');
const btnNew = document.getElementById('new');
const btnLoad = document.getElementById('load');

btnSave.addEventListener('click', saveXML);
btnNew.addEventListener('click', newQuestion);
btnLoad.addEventListener('click', loadXML);

const questions = [];

questions.push({
    question: {
        qtext: 'Wie gehts?',
        answers: [{
            answer: {
                text: 'gut',
                correct: true
            }
        }, {
            answer: {
                text: 'schlecht',
                correct: false
            }
        }]
    }
});

function saveXML(evt) {
    let xmlStr = '<?xml version="1.0" encoding="UTF-8"?><quiz></quiz>'
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
    let quiz = xmlDoc.getElementsByTagName('quiz')[0];

    const titleInput = document.getElementById('title-input');
    const nameAttr = xmlDoc.createAttribute('name');
    nameAttr.nodeValue = titleInput.value;
    quiz.setAttributeNode(nameAttr);
    console.log(quiz);

    quiz = buildXML(quiz, questions, xmlDoc);
    console.log(quiz);
}

function buildXML(root, obj, xmlDoc) {
    if (obj instanceof Array) {
        obj.forEach(entry => {
            root = (buildXML(root, entry, xmlDoc));
        })
    } else if (obj instanceof Object) {
        let names = Object.getOwnPropertyNames(obj);
        names.forEach(name => {
            let prop = obj[name];
            let elemNode = xmlDoc.createElement(name);
            console.log(typeof prop);
            if (prop instanceof Array || prop instanceof Object) {
                elemNode = (buildXML(elemNode, prop, xmlDoc));
                root.appendChild(elemNode);
            } else if(typeof prop === "boolean") {
                let attrNode = xmlDoc.createAttribute(name);
                attrNode.nodeValue = prop;
                root.setAttributeNode(attrNode);
            } else if(name === "text") {
                let textNode = xmlDoc.createTextNode(prop);
                root.appendChild(textNode);
            }
            else {
                let textNode = xmlDoc.createTextNode(prop);
                elemNode.appendChild(textNode);
                root.appendChild(elemNode);
            }
        });
    }

    return root;
}


// EventListener for Loading a already exisiting Quiz from a XML-File
function loadXML(evt) {
    const finput = document.createElement('input');
    finput.setAttribute('type', 'file');
    finput.setAttribute('accept', 'application/xml');
    finput.addEventListener('change', function (evt) {
        loadXMLfromFile(finput.files[0], fillExistingQuiz);
    })
    finput.click();
}

// after receiving the XML Contents this method fills the Website
// todo Error Handling for wrong XML-File
function fillExistingQuiz(xmlDoc) {
    let quiz = xmlDoc.getElementsByTagName('quiz')[0];

    if (!quiz) {
        alert('XML-Datei ist kein Quiz!');
        return;
    }

    let quizName = quiz.getAttribute('name');
    const titleInput = document.getElementById('title-input');
    titleInput.value = quizName;
}


function newQuestion(evt) {
    currentQuestion++;
}