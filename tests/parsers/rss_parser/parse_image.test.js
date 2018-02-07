const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseImage', () => {

  before(() => {
    this.rssParser = new RssParser()
  })


  it('should parse image', () => {
    const result = this.rssParser.parseImage({
      url: ['https://feed.com/image.png'],
      title: ['image'],
      description: ['something'],
      width: ['300'],
      height: ['300'],
      type: ['image/png'],
      unexpected: ['idc..']
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
})
