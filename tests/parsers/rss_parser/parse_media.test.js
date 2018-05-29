const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseMedia', () => {

  before(() => {
    this.rssParser = new RssParser()

    this.feedImage = {
      url: ['https://feed.com/image.png'],
      title: ['image'],
      description: ['something'],
      width: ['300'],
      height: ['300'],
      type: ['image/png'],
      unexpected: ['idc..']
    }

    this.mediaImage = {
      url: 'https://feed.com/image.png',
      title: 'image',
      description: 'something',
      width: '300',
      height: '300',
      type: 'image/png'
    }
  })


  it('should parse media from enclosure tag', () => {
    const result = this.rssParser.parseMedia({
      enclosure: [
        this.feedImage
      ]
    })

    return expect(result).to.deep.equals([
      this.mediaImage
    ])
  })


  it('should parse media from media:content tag', () => {
    const result = this.rssParser.parseMedia({
      'media:content': [
        this.feedImage
      ]
    })

    return expect(result).to.deep.equals([
      this.mediaImage
    ])
  })


  it('should parse media from media:group tag', () => {
    const result = this.rssParser.parseMedia({
      'media:group': [
        {
          'media:content': [
            this.feedImage
          ]
        }
      ]
    })

    return expect(result).to.deep.equals([
      this.mediaImage
    ])
  })
})