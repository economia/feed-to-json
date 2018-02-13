const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseChannelImage', () => {

  before(() => {
    this.rssParser = new RssParser()
  })


  it('should parse channel image', () => {
    const result = this.rssParser.parseChannelImage({
      image: [{
        url: ['https://feed.com/image.png'],
        title: ['image'],
        description: ['something'],
        width: ['300'],
        height: ['300'],
        type: ['image/png'],
      }]
    })

    return expect(result).to.deep.equals({
      url: 'https://feed.com/image.png',
      title: 'image',
      description: 'something',
      width: '300',
      height: '300',
      type: 'image/png'
    })
  })


  it('should not parse channel image', () => {
    const result = this.rssParser.parseChannelImage({})

    return expect(result).to.equals(undefined)
  })
})
