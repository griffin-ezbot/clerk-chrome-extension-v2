import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/chrome-extension";

const PUBLISHABLE_KEY =
  "pk_test_YmFsYW5jZWQtbW9sbHktODMuY2xlcmsuYWNjb3VudHMuZGV2JA";

const EXTENSION_URL = chrome.runtime.getURL(".");

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>();

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
    });
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl={`${EXTENSION_URL}/popup.html`}
      signInFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
      signUpFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
    >
      <main style={{ padding: "10px", minWidth: "400px", minHeight: "600px" }}>
        <SignedIn>
          <ul style={{ minWidth: "700px" }}>
            <li>Current URL: {currentURL}</li>
            <li>Current Time: {new Date().toLocaleTimeString()}</li>
          </ul>
          <button
            onClick={() => setCount(count + 1)}
            style={{ marginRight: "5px" }}
          >
            count up
          </button>
          <button onClick={changeBackground}>change background</button>
        </SignedIn>
        <SignedOut>
          <p>Sign in to use this extension.</p>
          <SignInButton mode="modal" />
        </SignedOut>
      </main>
    </ClerkProvider>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
