const URL = require('url').parse

export class Rss {

  /**
   * @param options
   */
  constructor (options) {
    this.options = Object.assign({}, {
      maxCount: null,
      maxTimeDiff: null
    }, options)
  }

  /**
   * @param data
   * @returns {Object}
   */
  parse (data) {
    const channel = this.parseChannel(data)
    channel.image = this.parseChannelImage(data)
    channel.items = this.parseItems(data)

    return channel
  }

  /**
   * @param data
   * @returns {Object}
   */
  parseChannel (data) {
    const channel = this.extractStructure([
      'title', 'description', 'link', 'domain', 'name'
    ], data)

    if (channel.link) {
      const url = URL(channel.link)
      channel.domain = url.hostname.replace(/(http:\/\/|https:\/\/|\/|www.|blog.)/g, '')
      channel.name = channel.domain.split('.').slice(0, 1)[0]
    }

    return channel
  }

  /**
   * @param data
   * @returns {Object}
   */
  parseChannelImage (data) {
    return data.image ? this.parseImage(data.image[0]) : undefined
  }

  /**
   * @param data
   * @returns {Array}
   */
  parseItems (data) {
    const items = []

    items.push(this.parseItem(data.item[0]))

    return items
  }

  /**
   * @param data
   * @returns {Object}
   */
  parseItem (data) {
    const item = this.extractStructure([
      'title', 'description', 'link', {target: 'pubDate', as: 'date'}, 'timestamp'
    ], data)

    if (item.date) {
      item.timestamp = parseInt(new Date(item.date).getTime() / 1000)
    }
    item.media = this.parseEnclosure(data)

    return item
  }

  /**
   * @param data
   * @returns {Array}
   */
  parseEnclosure (data) {
    let media = []

    if (data['media:group']) {
      media = data['media:group'][0]['media:content']
    }
    if (data['media:content']) {
      media = data['media:content']
    }
    if (data['enclosure']) {
      media = data['enclosure']
    }

    return media.map(element => this.parseImage(element))
  }

  /**
   * @param data
   * @returns {Object}
   */
  parseImage (data) {
    return this.extractStructure([
      'url', 'title', 'description', 'width', 'height', 'type'
    ], data)
  }

  /**
   * @param structure
   * @param data
   * @returns {Object}
   */
  extractStructure (structure, data) {
    const result = {}

    structure.forEach(attribute => {
      let inputKey = attribute
      let resultKey = attribute

      if (attribute instanceof Object) {
        inputKey = attribute.target
        resultKey = attribute.as
      }

      result[resultKey] = this.extractAttr(inputKey, data)
    })

    return result
  }

  /**
   * @param attribute
   * @param input
   * @param empty
   * @returns {*}
   */
  extractAttr (attribute, input, empty) {
    return input[attribute] ? input[attribute][0] : empty
  }
}
