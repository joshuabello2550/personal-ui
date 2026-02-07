import { getElementsCSS } from "./getpageCSS.js";
import { agentFunction } from "./agent.js";

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

  const pageCSS = await getPageCSS(tabId);

  const newCSS = await getInsertCSS(pageHTML, pageCSS, messageText, tabId);

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
        func: getElementsCSS,
      },
      (results) => {
        resolve(results[0].result);
      }
    );
  });
};

const getInsertCSS = (pageHTML, pageCSS, messageText, tabId) => {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: agentFunction,
        args: [pageHTML, pageCSS, messageText],
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
};
