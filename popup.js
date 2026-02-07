const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUIRequest();
});

const handleUIRequest = async () => {
  const messageText = messageInput.value.trim();

  const tabId = (await getCurrentTab()).id;

  const html = await getPageHTML(tabId);
  console.log("html: ", html);

  addChanges(tabId);
  if (messageText) {
    // Clear the input field
    messageInput.value = "";
  }
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

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const insertCSS = `
  #masthead-container.ytd-app{
    top: 20px !important;
  }
`;

const addChanges = (tabId) => {
  chrome.scripting.insertCSS({
    target: { tabId: tabId },
    // files: ["content-script.js"],
    css: insertCSS,
  });
  console.log("Changes added");
};
