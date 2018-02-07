const request = require('request')
const xml2js = require('xml2js')
const RssParser = require('./parsers/RssParser')

class Feed {
  /**
   * @param options
   */
  constructor(options) {
    this.options = Object.assign({}, {
      timeout: 1000,
      count: null
    }, options)
    this.request = request
    this.xmlParser = new xml2js.Parser({trim: false, normalize: true, mergeAttrs: true})
  }

  /**
   * @param url
   * @param options
   * @returns {Promise}
   */
  load(url, options) {
    this.options = Object.assign({}, this.options, options)

    return this.sendRequest(url)
      .then(response => {
        return this.parseXmlToJson(response.xml)
      }).then(json => {
        return this.parseFeed(json)
      })
  }

  /**
   * @param url
   * @returns {Promise}
   */
  sendRequest(url) {
    return new Promise((resolve, reject) => {
      this.request.get({
        url: url,
        headers: {
          accept: 'application/rss+xml'
        },
        pool: false,
        followRedirect: true,
        timeout: this.options.timeout
      }, (error, response, xml) => {
        if (error || response.statusCode !== 200) {
          return reject(error)
        }

        return resolve({response, xml})
      })
    })
  }

  /**
   * @param xml
   * @returns {Promise}
   */
  parseXmlToJson(xml) {
    return new Promise((resolve, reject) => {
      this.xmlParser.parseString(xml, (error, json) => {
        if (error) {
          return reject(error)
        }

        return resolve(json)
      })
    })
  }

  /**
   * @param data
   * @returns {Promise}
   */
  parseFeed(data) {
    return new Promise((resolve, reject) => {
      if (data.rss) {
        const rssParser = new RssParser(this.options)
        return resolve(rssParser.parse(data.rss.channel[0]))
      }

      reject(new Error('Unknown feed type'))
    })
  }
}

module.exports = Feed
