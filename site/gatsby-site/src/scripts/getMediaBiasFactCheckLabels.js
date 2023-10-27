const axios = require('axios');

const jsdom = require('jsdom');

const getPublications = async () => {
  const { JSDOM } = jsdom;

  let publications = [];

  const addBiasLabel = (publicationTitle, publicationDomain, labeler, label) => {
    const existingPublication = publications.find((p) => p.domain == publicationDomain);

    if (existingPublication) {
      const sameLabel = existingPublication.bias_labels.find(
        (existing_bias_label) =>
          existing_bias_label.label == label && existing_bias_label.labeler == labeler
      );

      if (!sameLabel) {
        existingPublication.bias_labels.push({ label, labeler });
      }
    } else {
      publications.push({
        title: publicationTitle,
        domain: publicationDomain,
        bias_labels: [{ label, labeler }],
      });
    }
  };

  for (const alignment of [
    'left',
    'leftcenter',
    'center',
    'right-center',
    'right',
    'fake-news',
    'conspiracy',
  ]) {
    const mbfcResponse = await axios.get('https://mediabiasfactcheck.com/' + alignment);

    if (mbfcResponse.status == 200) {
      const mbfcPage = new JSDOM(mbfcResponse.data);

      for (const tr of [...mbfcPage.window.document.querySelectorAll('#mbfc-table tr')]) {
        const deepestChild = getDeepestChild(tr);

        let tokens = deepestChild.textContent.split(' ');

        let lastToken = tokens.pop();

        let domain;

        if (lastToken[0] == '(') {
          domain = new URL(
            'http://' +
              lastToken
                .slice(1, lastToken.length - 1) // Remove parentheses
                .replace(/^(www|m)\./, '')
          ).hostname;
        } else {
          tokens.push(lastToken);
        }
        const title = tokens.join(' ');

        if (domain) {
          addBiasLabel(
            title,
            domain,
            'mediabiasfactcheck.com',
            {
              left: 'left',
              right: 'right',

              // These occur in most sources, and it's best to normalize them
              // to a specific spelling / wording across sources
              // so we can check if different sources agree.
              leftcenter: 'center-left',
              'right-center': 'center-right',

              // They use "center" in the url but "least biased" in the site text.
              // There's a difference between being unbiased
              // and being biased towards the center.
              // They seem to be trying to capture the former:
              //
              //  > These sources have minimal bias and use very few loaded words
              //  > (wording that attempts to influence an audience
              //  >  by using appeal to emotion or stereotypes).
              //  > The reporting is factual and usually sourced.
              //  > These are the most credible media sources.
              //
              // Same with "fake-news" and "conspiracy".
              center: 'least biased',
              'fake-news': 'questionable',
              conspiracy: 'conspiracy/pseudoscience',
            }[alignment]
          );
        }
      }
    }
  }
  publications = publications.filter(
    (p) =>
      p.domain.includes('.') &&
      !p.domain.includes(' ') &&
      // There are a couple cases where a source is listed
      // e.g. center-left *and* center-right.
      p.bias_labels.length < 2
  );
  return publications;
};

const getDeepestChild = (htmlNode) => {
  if (htmlNode.children.length == 0) {
    return htmlNode;
  } else {
    return getDeepestChild(htmlNode.children[0]);
  }
};

getPublications().then((p) => console.log(JSON.stringify(p, null, 2)));
