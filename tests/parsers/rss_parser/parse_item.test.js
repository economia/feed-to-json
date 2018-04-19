const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseItems', () => {

  before(() => {
    this.rssParser = new RssParser()

    this.feedItem = {
      title: ['item item'],
      description: ['something'],
      link: ['https://feed.com/article'],
      pubDate: ['Wed, 07 Feb 2018 12:14:35 +0100']
    }

    this.parsedItem = {
      title: 'item item',
      description: 'something',
      link: 'https://feed.com/article',
      date: 'Wed, 07 Feb 2018 12:14:35 +0100',
      media: []
    }
  })


  it('should parse one item', () => {
    const result = this.rssParser.parseItem(this.feedItem)

    return expect(result).to.deep.equals(this.parsedItem)
  })


  it('should parse collection of items', () => {
    const result = this.rssParser.parseItems({
      item: [
        this.feedItem
      ]
    })

    return expect(result).to.deep.equals([
      this.parsedItem
    ])
  })
})
