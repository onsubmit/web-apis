if (!CSS.highlights) {
  console.error('CSS Custom Highlight API not supported in this browser.');
  return;
}

// ___Begin visible code snippet___

const allTextNodes = getTextNodes();

const query = document.getElementById('query');
query.addEventListener('input', () => {
  CSS.highlights.clear();

  const searchValue = query.value.trim().toLowerCase();
  if (!searchValue) {
    return;
  }

  const ranges = allTextNodes
    .map((node) => ({ node, text: node.textContent.toLowerCase() }))
    .flatMap(({ node, text }) =>
      getMatchIndices(text, searchValue).map((index) => createRange(node, index, searchValue.length))
    );

  // eslint-disable-next-line no-undef
  const highlight = new Highlight(...ranges);
  CSS.highlights.set('search-results', highlight);
});

function getTextNodes() {
  const article = document.querySelector('article');
  const treeWalker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
  const allTextNodes = [];
  let currentNode = treeWalker.nextNode();
  while (currentNode) {
    allTextNodes.push(currentNode);
    currentNode = treeWalker.nextNode();
  }

  return allTextNodes;
}

function getMatchIndices(text, searchValue) {
  const indices = [];

  let startPos = 0;
  while (startPos < text.length) {
    const index = text.indexOf(searchValue, startPos);
    if (index === -1) break;
    indices.push(index);
    startPos = index + searchValue.length;
  }

  return indices;
}

function createRange(el, index, length) {
  /// @codemirror/state exports a Range class that mysteriously
  /// overrides window.Range but only in PROD build ¯\_(ツ)_/¯
  const range = new window.Range();
  range.setStart(el, index);
  range.setEnd(el, index + length);
  return range;
}
