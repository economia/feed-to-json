const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parse', () => {

  before(() => {
    this.rssParser = new RssParser()
  })


  it('should parse whole feed', () => {
    const result = this.rssParser.parse({
      title: ['feed'],
      description: ['test feed'],
      link: ['https://feed.com/mrss/'],
      item: []
    })

    return expect(result).to.deep.equals({
      title: 'feed',
      description: 'test feed',
      link: 'https://feed.com/mrss/',
      domain: 'feed.com',
      name: 'feed',
      image: undefined,
      items: []
    })
  })
})
