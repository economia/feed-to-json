const axios = require('axios')
const xml2js = require('xml2js')
const RssParser = require('./parsers/RssParser')

class Feed {
  /**
   * @param {Object} options
   */
  constructor(options = {}) {
    this.options = options
    this.xmlParser = new xml2js.Parser({trim: false, normalize: true, mergeAttrs: true})
  }

  /**
   * @returns {Object}
   */
  get options () {
    return this._options || {
      timeout: 1000,
      count: null,
      headers: {}
    }
  }

  /**
   * @param {Object} options
   */
  set options (options) {
    this._options = Object.assign({}, this.options, options)
  }

  /**
   * @param {String} url
   * @param {Object} options
   * @returns {Promise}
   */
  load(url, options = {}) {
    this.options = options

    return this.sendRequest(url)
      .then(response => {
        return this.parseXmlToJson(response.data)
      }).then(json => {
        return this.parseFeed(json)
      })
  }

  /**
   * @param {String} url
   * @returns {Promise}
   */
  sendRequest(url) {
    this.options.headers = Object.assign({}, this.options.headers, {
      Accept: 'application/rss+xml'
    })

    return axios.get(url, this.options)
  }

  /**
   * @param {String} xml
   * @returns {Promise}
   */
  parseXmlToJson(xml) {
    return new Promise((resolve, reject) => {
      const escaped = xml.replace(/\s&\s/g, ' &amp; ')
      this.xmlParser.parseString(escaped, (error, json) => {
        if (error) {
          return reject(error)
        }

        return resolve(json)
      })
    })
  }

  /**
   * @param {Object} data
   * @returns {Promise}
   */
  parseFeed(data) {
    return new Promise((resolve, reject) => {
      if (data.rss) {
        const rssParser = new RssParser(this.options)
        return resolve(rssParser.parse(data.rss.channel[0]))
      }

      return reject(new Error('Unknown feed type'))
    })
  }
}

module.exports = Feed
