---
description: "Chrome Extensions"
---

Most of the extensions listed here have been born out of personal necessity, others have been created out of boredom or my desire to make something better.

The QR generator was originally a bookmarklet with code hosted on googles code repository as a way of having web-accessible resources before those resources were readily available.  While it was openly available to anyone, it was never really intended for public use.  After finding out the bookmarklet was making rounds in a few ycombinator forums, I noticed there were bug reports.  After fixing the issues I put analytics on the google code page and updated it with some instructions on how to use it, after a few months of gathering data I was surprised to see it getting hits from countries all over the world.

When Google closed their code repository down I created a Chrome extension for the QR generator.  After finding out how easy they were to write, I made others to either add features to sites I felt were missing, or improve the UX on sites like kickstarter.

---
<a title="Go to GitHub repo" href="https://github.com/shaunsational/chrome-ext-QR/"><img alt="Go to GitHub repo" align="right" src="/assets/github.svg" height="24"></a>
<img src="/assets/pixel.gif" width="15" align="right">
<a title="Go to this extension in the Chrome Webstore" href="https://chrome.google.com/webstore/detail/qr-generator/nfmaemgfedbiaajgieapbfhmonobpdib"><sub><img alt="Go to this extension in the Chrome Webstore" align="right" src="/assets/webstore.svg" height="24"></sub></a>
## [The QR Generator](https://chrome.google.com/webstore/detail/qr-generator/nfmaemgfedbiaajgieapbfhmonobpdib)

Where it all began!  This extension creates a _small icon in the browser bar_<sup id="a1">[1](#df1)</sup> that when clicked, will generate a QR code in an overlay that contains one of the following in this order:
1. Any selected text on the page
<sub><sup>(this has not been tested with large amounts of text)</sup></sub>
1. If the current URL is a google maps URL it will attempt to get the short URL from the share link
<sub><sup>(this was just updated to the new google maps format, it may not work 100% all of the time yet)</sup></sub>
1. The URL of the current page

If you have issues with this extension please report them on the [QR Generator GitHub issues page](https://github.com/shaunsational/chrome-ext-QR/issues)

---
<a title="Go to GitHub repo" href="https://github.com/shaunsational/chrome-ext-ActiveTabs"><img alt="Go to GitHub repo" align="right" src="/assets/github.svg" height="24"></a>
<img src="/assets/pixel.gif" width="15" align="right">
<a title="Go to this extension in the Chrome Webstore" href="https://chrome.google.com/webstore/detail/pbihheplocihoglaokfdcjadbjlhijgb"><sub><img alt="Go to this extension in the Chrome Webstore" align="right" src="/assets/webstore.svg" height="24"></sub></a>
## [Active Tabs](https://chrome.google.com/webstore/detail/pbihheplocihoglaokfdcjadbjlhijgb)
The essential addon for the Tabaholic!  This extension creates a _small icon in the browser bar_<sup id="a1">[1](#df1)</sup> that when clicked, shows a searchable list of all tabs across all windows<sup id="a2">[2](#df2)</sup>.  The search will refine the list to items matching text in either the title of the tab, the URL of the page, or even a few keywords that can be incredibly useful.

Have you ever reloaded chrome to have audio start playing out of some random tab but there's so many they're too small to see the speaker icon? We got you covered, search for "_audio" and it will only show tabs currently playing sound (and ones that have _audio in the title or URL, a slight drawback) then use the up/down keys to highlight a tab and press "m" to mute it, or "c" to close it!

On the main view when there is no text to filter, you can collapse a windows tab list; close out individual tabs; or even close entire windows, and don't worry about closing the wrong one, we'll prompt you before closing the tab/window.

Press "?" with or without shift, We aren't picky about it, to get a full list of keyboard commands and searchable keywords available once you've loaded the extension.

If you have issues with this extension please report them on the [Active Tabs GitHub issues page](https://github.com/shaunsational/chrome-ext-ActiveTabs/issues)

---
<a title="Go to GitHub repo" href="https://github.com/shaunsational/chrome-ext-CHP"><img alt="Go to GitHub repo" align="right" src="/assets/github.svg" height="24"></a>
<img src="/assets/pixel.gif" width="15" align="right">
<a title="Go to this extension in the Chrome Webstore" href="https://chrome.google.com/webstore/detail/dmfhnnchojmhbfgamododmboenaboden"><sub><img alt="Go to this extension in the Chrome Webstore" align="right" src="/assets/webstore.svg" height="24"></sub></a>
## [CHP Coordinates](https://chrome.google.com/webstore/detail/dmfhnnchojmhbfgamododmboenaboden)
For the chismoso in all of us! This extension is only going to be useful to you if you live in California.  Our Highway Patrol is gracious enough to bestow upon us a [website](http://cad.chp.ca.gov/Traffic.aspx) that shows all of the traffic issues currently happening in the areas.

Originally they only provided the GPS coordinates as plain text and this extension loads the location into a google map in a popup complete with a pin that shows the time and type of incident reported.  You can open more incidents into the same popup if you don't close it.

The CHP has since added their own link direct to a google map, but that directs you away from the site with more detailed information about the incident.  I plan to add this information to the pin itself in a future version.

However, Google is now charging for its maps API usage past a certain limit, and I may remove this extension if I start to get billed for it.

If you have issues with this extension please report them on the [CHP Coordinates GitHub issues page](https://github.com/shaunsational/chrome-ext-CHP/issues)

---
##### Footnotes
<ol>
	<li id="df1">A **browser_action** for those familiar with chrome extensions. <a href="#a1">↩</a></li>
	<li id="df2">The extension can only show incognito windows and their tabs if you have enabled it incognito on the extension detail page.  I cannot directly link you to this unfortunately <a href="chrome://extensions/?id=pbihheplocihoglaokfdcjadbjlhijgb">chrome://extensions/?id=pbihheplocihoglaokfdcjadbjlhijgb</a> you'll have to copy and paste that link. <a href="#a2">↩</a></li>
</ol>
