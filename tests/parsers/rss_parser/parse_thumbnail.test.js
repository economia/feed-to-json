const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseThumbnail', () => {

  before(() => {
    this.rssParser = new RssParser()

    this.feedThumbnail = {
      url: ['https://feed.com/image.png'],
      title: ['image'],
      description: ['something'],
      width: ['150'],
      height: ['150'],
      type: ['image/png'],
      unexpected: ['idc..']
    }

    this.thumbnail = {
      url: 'https://feed.com/image.png',
      title: 'image',
      description: 'something',
      width: '150',
      height: '150',
      type: 'image/png'
    }
  })


  it('should parse thumbnail from media:thumbnail tag', () => {
    const result = this.rssParser.parseThumbnail({
      'media:thumbnail': [
        this.feedThumbnail
      ]
    })

    return expect(result).to.deep.equals(this.thumbnail)
  })


  it('should parse thumbnail from media:group tag', () => {
    const result = this.rssParser.parseThumbnail({
      'media:group': [
        {
          'media:thumbnail': [
            this.feedThumbnail
          ]
        }
      ]
    })

    return expect(result).to.deep.equals(this.thumbnail)
  })
})
