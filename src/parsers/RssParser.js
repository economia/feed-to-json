class RssParser {
  /**
   * @param {Object} options
   */
  constructor (options = {}) {
    this.options = options
  }

  /**
   * @returns {Object}
   */
  get options () {
    return this._options || {
      count: null
    }
  }

  /**
   * @param {Object} options
   */
  set options (options) {
    this._options = Object.assign({}, this.options, options)
  }

  /**
   * @param {Object} data
   * @returns {Object}
   */
  parse (data) {
    const channel = this.parseChannel(data)
    channel.image = this.parseChannelImage(data)
    channel.items = this.parseItems(data)

    return channel
  }

  /**
   * @param {Object} data
   * @returns {Object}
   */
  parseChannel (data) {
    return this.extractStructure([
      'title', 'description', 'link'
    ], data)
  }

  /**
   * @param {Object} data
   * @returns {Object}
   */
  parseChannelImage (data) {
    return data.image ? this.parseImage(data.image[0]) : undefined
  }

  /**
   * @param {Object} data
   * @returns {Array}
   */
  parseItems (data) {
    const source = data.item || []
    const count = this.options.count || source.length

    return source.slice(0, count).map(item => this.parseItem(item))
  }

  /**
   * @param {Object} data
   * @returns {Object}
   */
  parseItem (data) {
    const item = this.extractStructure([
      'title', 'description', 'link', {target: 'pubDate', as: 'date'}
    ], data)

    item.thumbnail = this.parseThumbnail(data)
    item.media = this.parseMedia(data)

    return item
  }

  /**
   * @param data
   * @returns {Object}
   */
  parseThumbnail (data) {
    let thumbnail

    if (data['media:thumbnail']) {
      thumbnail = this.parseImage(data['media:thumbnail'][0])
    }
    if (data['media:group'] && data['media:group'][0]['media:thumbnail']) {
      thumbnail = this.parseImage(data['media:group'][0]['media:thumbnail'][0])
    }

    return thumbnail
  }

  /**
   * @param {Object} data
   * @returns {Array}
   */
  parseMedia (data) {
    let media = []

    if (data['enclosure']) {
      media = data['enclosure']
    }
    if (data['media:content']) {
      media = data['media:content']
    }
    if (data['media:group'] && data['media:group'][0]['media:content']) {
      media = data['media:group'][0]['media:content']
    }

    return media.map(element => this.parseImage(element))
  }

  /**
   * @param {Object} data
   * @returns {Object}
   */
  parseImage (data) {
    return this.extractStructure([
      'url', 'title', 'description', 'width', 'height', 'type'
    ], data)
  }

  /**
   * @param {Array} structure
   * @param {Object} data
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

      result[resultKey] = this.extractAttribute(inputKey, data)
    })

    return result
  }

  /**
   * @param {String} attribute
   * @param {Object} input
   * @param empty
   * @returns {*}
   */
  extractAttribute (attribute, input, empty) {
    return input[attribute] ? input[attribute][0] : empty
  }
}

module.exports = RssParser