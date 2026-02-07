const CANDIDATE_SELECTOR = `
      main,
      article,
      section,
      aside,
      nav,
      header,
      footer,
      div,
      ul,
      ol,
      li
    `;

// const MAX_ELEMENTS = 150;

const isVisibleAndImportant = (el) => {
  const style = getComputedStyle(el);
  if (style.display === "none") return false;
  if (style.visibility === "hidden") return false;

  return true;
};

const summarizeElement = (el) => {
  const style = getComputedStyle(el);
  const parentStyle = el.parentElement
    ? getComputedStyle(el.parentElement)
    : null;

  const styles = {};
  for (let i = 0; i < style.length; i++) {
    const key = style[i];
    const value = style.getPropertyValue(key);

    // Only include if different from parent or if no parent
    if (!parentStyle || value !== parentStyle.getPropertyValue(key)) {
      styles[key] = value;
    }
  }

  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: [...el.classList],
    styles,
  };
};

const getElementsCSS = () => {
  const candidates = Array.from(document.querySelectorAll(CANDIDATE_SELECTOR));
  const scopedElements = [];
  for (const el of candidates) {
    if (!isVisibleAndImportant(el)) continue;

    scopedElements.push(summarizeElement(el));
  }

  const result = {
    elementCount: scopedElements.length,
    elements: scopedElements,
  };

  console.log("UI Style Snapshot:", result);

  return result;
};

getElementsCSS();
