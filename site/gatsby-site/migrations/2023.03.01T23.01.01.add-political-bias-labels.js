//const config = require('../config');
const axios = require('axios');

const jsdom = require('jsdom');

exports.up = async (/*{ context: { client } }*/) => {
  const { JSDOM } = jsdom;

  for (const alignment of ['left', 'leftcenter', 'center', 'right-center', 'right']) {
    console.log(`alignment`, alignment);
    const mbfcResponse = await axios.get('https://mediabiasfactcheck.com/' + alignment);

    if (mbfcResponse.status == 200) {
      const mbfcPage = new JSDOM(mbfcResponse.data);

      const sources = [...mbfcPage.window.document.querySelectorAll('#mbfc-table tr')]
        .map((tr) => {
          const deepestChild = getDeepestChild(tr);

          let tokens = deepestChild.textContent.split(' ');

          let lastToken = tokens.pop();

          let domain;

          if (lastToken[0] == '(') {
            domain = lastToken.slice(1, lastToken.length - 1); // Remove parentheses
          } else {
            tokens.push(lastToken);
          }
          const title = tokens.join(' ');

          return { title, domain };
        })
        .filter((source) => source?.title?.length > 0);

      console.log(`sources`, sources);
    }
  }
  throw 'ok';
};

exports.down = async () => {};

var getDeepestChild = (htmlNode) => {
  if (htmlNode.children.length == 0) {
    return htmlNode;
  } else {
    return getDeepestChild(htmlNode.children[0]);
  }
};
