const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseChannel', () => {

  before(() => {
    this.rssParser = new RssParser()
  })


  it('should parse channel information', () => {
    const result = this.rssParser.parseChannel({
      title: ['feed'],
      description: ['test feed'],
      link: ['https://feed.com/mrss/']
    })

    return expect(result).to.deep.equals({
      title: 'feed',
      description: 'test feed',
      link: 'https://feed.com/mrss/'
    })
  })
})
