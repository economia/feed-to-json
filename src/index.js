import request from 'request'
import xml2js from 'xml2js'
import { Rss } from './parsers/Rss'

export default class Feed {
  /**
   * @param options
   */
  constructor(options) {
    this.options = Object.assign({}, {
      timeout: 1000,
      maxCount: null,
      maxTimeDiff: null
    }, options)
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
      request({
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
        const result = new Rss(this.options).parse(data.rss.channel[0])
        return resolve(result)
      }

      reject(new Error('Unknown feed type'))
    })
  }
}
