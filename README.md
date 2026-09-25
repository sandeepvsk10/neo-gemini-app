# Stripped down Gemini app for cleaner UI/UX

Implemented this because I do genuinely love Gemini model for research & ideation but the poor UI/UX makes it unusable.


| Before UI script changes | After UI script changes |
| --- | --- |
| ![Gemini before UI script changes](assets/gemini-app-welcome-page.png) | ![Gemini after UI script changes](assets/neo-gemini-app-welcome-page.png) |

## Conversation UI Difference
![Gemini chat UI before and after the script changes](assets/chat-ui-before-after-wipe.gif)

## Setup

1. Install [Stylus](https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) and [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) from the Chrome Web Store.
2. In Stylus, create a new UserCSS style, paste the contents of [`neo-gemini-theme.user.css`](neo-gemini-theme.user.css), and save it.
3. In Tampermonkey, create a new userscript, replace its contents with [`gemini-composer-sizing.user.js`](gemini-composer-sizing.user.js), and save it.
4. Open `chrome://extensions`, select **Details** for Tampermonkey, and enable **Allow User Scripts**.
5. Make sure both extensions are enabled, then reload [Gemini](https://gemini.google.com/).

Disable the Stylus style and Tampermonkey userscript to restore Gemini's original interface.

## Copy this prompt for a computer use agent

```text
You are setting up a visual UI customization for the Gemini web app in my Chrome browser. Use this repository:
https://github.com/sandeepvsk10/neo-gemini-app

1. Read README.md and inspect both files before enabling anything:
   - neo-gemini-theme.user.css
   - gemini-composer-sizing.user.js
2. Sanity-check the files for backdoors or unexpected behavior. Confirm that the CSS and userscript do not make network requests, scrape or transmit page data, inject remote code, change account settings, bypass controls, or automate messages. Check the userscript metadata, permissions, external URLs, eval-like code, and any fetch/XHR/WebSocket usage. If anything suspicious or broader than local presentation and composer sizing is found, stop and report it instead of installing.
3. Install Stylus and Tampermonkey only from their official Chrome Web Store pages. Do not install similarly named extensions from other sources.
4. In Stylus, create or update a Gemini-only style and paste the complete contents of neo-gemini-theme.user.css. Save it and confirm it is enabled for gemini.google.com.
5. In Tampermonkey, create or update a userscript and paste the complete contents of gemini-composer-sizing.user.js. Save it. In chrome://extensions, open Tampermonkey's Details and enable “Allow User Scripts” if it is not already enabled.
6. Reload Gemini and verify that the theme is active, the composer resizes normally, and sending a prompt still works. Do not send, delete, or edit any real conversation content during testing; use a temporary chat or a harmless local check.
7. Report what was installed, what permissions were observed, what security checks passed, and any step that requires my manual confirmation. Never enter or reveal passwords, cookies, API keys, or other private data.
```

## Disclaimer

This project is a personal, local interface customization created only to improve readability and comfort. 


It applies CSS in the browser and uses a local helper to size the text composer, it is not intended to modify Gemini's code, bypass controls, scrape content, automate requests, or interfere with Google services. Gemini and related marks belong to Google.


With that being said, would be happy to take down if prompted! Reach out to https://x.com/sandeepvsk10

<br>

Made with GPT-5.6 Sol.
