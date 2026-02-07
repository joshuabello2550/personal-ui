const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUIRequest();
});

const handleUIRequest = async () => {
  const messageText = messageInput.value.trim();

  const tabId = (await getCurrentTab()).id;

  const pageHTML = await getPageHTML(tabId);
  console.log("html: ", pageHTML);

  const pageCSS = await getPageCSS(tabId);
  console.log("pageCSS: ", pageCSS);

  const newCSS = getInsertCSS(pageHTML, pageCSS, messageText);

  console.log("newCSS: ", newCSS);
  addChanges(tabId, newCSS);

  if (messageText) {
    // Clear the input field
    messageInput.value = "";
  }
};

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const getPageHTML = (tabId) => {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => document.body.innerHTML,
      },
      (results) => {
        resolve(results[0].result);
      }
    );
  });
};

const getPageCSS = (tabId) => {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["getPageCSS.js"],
      },
      (results) => {
        resolve(results[0].result);
      }
    );
  });
};

const getInsertCSS = (pageHTML, pageCSS, messageText) => {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ["agent.js"],
      },
      (results) => {
        resolve(results[0].result);
      }
    );
  });
};

// const insertCSS = `
//   #masthead-container.ytd-app{
//     top: 20px !important;
//   }
// `;

const addChanges = (tabId, insertCSS) => {
  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    // files: ["content-script.js"],
    css: insertCSS,
  });
  console.log("Changes added");
};
