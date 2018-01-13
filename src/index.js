import request from 'request'
import xml2js from 'xml2js'

const ACCEPT = 'text/html,application/rss+xml,application/xhtml+xml'
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'

export default class Rss {
  /**
   * @param options
   */
  constructor(options) {
    this.options = Object.assign({}, {
      timeout: 1000,
      maxCount: null,
      maxTimeDiff: null
    }, options)
  }

  /**
   * @param url
   * @returns {Promise.<TResult>}
   */
  load(url) {
    return this.sendRequest(url)
      .then(response => {
        return this.parseXmlToJson(response.xml)
      }).then(json => {
        return this.parseRssChannel(json)
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
          accept: ACCEPT,
          'user-agent': USER_AGENT
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
      const parser = new xml2js.Parser({trim: false, normalize: true, mergeAttrs: true})
      parser.parseString(xml, (error, json) => {
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
  parseRssChannel(data) {
    return new Promise(resolve => {
      let index = 0
      const rawChannel = Array.isArray(data.rss.channel) ? data.rss.channel[0] : data.rss.channel
      const maxCount = (this.options.maxCount) ? this.options.maxCount : rawChannel.item.length
      const maxTimeDiff = (this.options.maxTimeDiff) ? new Date().getTime() - this.options.maxTimeDiff * 1000 : null
      const parsedChannel = this.parseChannelMeta(rawChannel)
      parsedChannel.items = []

      while (index < rawChannel.item.length && parsedChannel.items.length < maxCount) {
        const item = this.parseItem(rawChannel.item[index])

        if (maxTimeDiff && (item.timestamp >= maxTimeDiff)) {
          parsedChannel.items.push(item)
        }

        index++
      }

      return resolve(parsedChannel)
    })
  }

  /**
   * @param data
   * @returns {{}}
   */
  parseChannelMeta(data) {
    const meta = {}

    if (data.title) {
      meta.title = data.title[0]
    }
    if (data.description) {
      meta.description = data.description[0]
    }
    if (data.link && data.link[0]) {
      meta.link = data.link[0]
      meta.domain = meta.link.replace(/(http:\/\/|https:\/\/|\/|www.|blog.)/g, '')
      meta.name = meta.domain.split('.').slice(0, 1)[0]
    }
    if (data.image) {
      meta.image = this.parseChannelImage(data.image[0])
    }

    return meta
  }

  /**
   * @param data
   * @returns {{}}
   */
  parseChannelImage(data) {
    const image = {}

    if (data.url) {
      image.src = data.url[0]
    }
    if (data.title) {
      image.title = data.title[0]
    }
    if (data.description) {
      image.alt = data.description[0]
    }
    if (data.width) {
      image.width = data.width[0]
    }
    if (data.height) {
      image.height = data.height[0]
    }

    return image
  }

  /**
   * @param data
   * @returns {{}}
   */
  parseItem(data) {
    const item = {}

    if (data.title) {
      item.title = data.title[0]
    }
    if (data.description) {
      item.description = data.description[0]
    }
    if (data.link) {
      item.link = data.link[0]
    }
    if (data.pubDate) {
      item.date = data.pubDate[0]
      item.timestamp = new Date(data.pubDate[0]).getTime()
    }
    item.media = this.parseMedia(data)

    return item
  }

  /**
   * @param data
   * @returns {{}}
   */
  parseMedia(data) {
    const media = {}

    if (data['media:content']) {
      media.content = data['media:content']
    }
    if (data['media:thumbnail']) {
      media.thumbnail = data['media:thumbnail']
    }
    if (data['media:group'] && data['media:group'][0] && data['media:group'][0]['media:content']) {
      if (data['media:group'][0]['media:content']) {
        media.content = data['media:group'][0]['media:content']
      }
      if (data['media:group'][0]['media:thumbnail']) {
        media.thumbnail = data['media:group'][0]['media:thumbnail']
      }
    }

    return media
  }
}
