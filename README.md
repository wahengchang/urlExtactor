# urlExtactor
This open-source project provides a command-line interface for automating the collection of internal links (same domain) from a website using web scraping techniques. The program uses a state machine to manage three lists of links: discover, todo, and done. The discover list contains links to be visited, the todo list contains links to be processed, and the done list contains links that have already been processed.

## Node Version
```
v12
```

## Installation
To install the project, you'll need to have Node.js and npm (Node Package Manager) or Yarn installed on your system. Then, follow these steps:

 - Clone this repository to your local machine by running `$git clone git@github.com:wahengchang/internalUrlLinkScraper.git` in your terminal.
 - Run npm install or yarn install to install the project's dependencies.


## Run
Example, if I wanna get all the links which fellow the rule of regular expression `"/Bitcoin/"`, from the bitcoin page of reddit.com, with real browser`(axios will be use when false)`:
```
$ node main.js  start --url https://www.reddit.com/r/Bitcoin --browser --regexp "/Bitcoin/" -v
```

## Resume Task
Whenever the process is stoped, as long as the input url is exact the same, the task will continue to scrape the rest of internal link (continue appending new links into todo).

To Reseume Task, just input the same command
```
$ node main.js  start --url https://www.reddit.com/r/Bitcoin --browser --regexp "/Bitcoin/" -v
```

## Help
To see the parameters of command:
```
$ node main.js  help
```
output
```
main.js [command]

Commands:
  main.js start  start scrape

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
      --url      The url of the page that is going to scrape            [string]
      --regexp   The regular expression that all the links should match [string]
  -v, --verbose  Run with verbose logging                              [boolean]
  ```


## Reference
- https://github.com/wahengchang/internalUrlLinkScraper