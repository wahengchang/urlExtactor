# urlExtactor
A node.js base url extractor, which recursively extracts all links, internal links and extenal links from a given site with url. And save all the links in a `.txt` all the scrapping tasks are done.

## Start
Example, if I wanna get all the links which fellow the rule of regular expression `"/Bitcoin/"`, from the bitcoin page of reddit.com, with real browser`(axios will be use when false)`:
```
$ node main.js  start --url https://www.reddit.com/r/Bitcoin --browser --regexp "/Bitcoin/" -v
```