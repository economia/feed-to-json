Feed to json
=================

Util for parse ATOM and RSS feed resources and normalize them to JSON object.

## Install

```sh
npm install feed-to-json-promise --save
```

## ES6 import

```js
import Feed from 'feed-to-json-promise'
``` 

## Common js import

```js
const Feed = require('feed-to-json-promise')
```

## Example

```js
import Feed from 'feed-to-json-promise'

const feed = new Feed()
feed.load('http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml').then(feed => {
  console.log(feed)
}).catch(error => {
  console.error(error)
})
```

## Result
```json

{
  "title": "NYT > Home Page",
  "description": "The New York Times: Find breaking news",
  "link": "http://www.nytimes.com/pages/index.html?partner=rss&emc=rss",
  "image": {
    "title": "NYT > Home Page",
    "url": "https://static01.nyt.com/images/misc/NYT_logo_rss_250x40.png"
  },
  "items":[
    {
      "title": "North Korea, Cuba, Southwest Airlines: Your Thursday Briefing",
      "description": "Here’s what you need to know to start your day.",
      "link": "https://www.nytimes.com/2018/04/19/briefing/north-korea-cuba-southwest-airlines.html?partner=rss&emc=rss",
      "date": "Thu, 19 Apr 2018 12:45:36 GMT",
      "media": [
        {
          "url": "https://static01.nyt.com/images/2018/04/19/world/americas/19us-ambriefing-castro/19us-ambriefing-castro-moth.jpg",
          "title": "North Korea",
          "description": "North Korea, Cuba, Southwest Airlines",
          "width": "396",
          "height:": "264"
        }
      ]
    }
  ]
}
```

## Options

Name | Default | Required | Description
--- | --- | --- | ---
count | null | false | maximum number of items in feed
timeout | 1000 | false | timeout for http request
