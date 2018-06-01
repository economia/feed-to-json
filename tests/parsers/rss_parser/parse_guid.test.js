const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseGuid', () => {

  before(() => {
    this.rssParser = new RssParser()
  })

  it('should parse guid without perma link attribute', () => {
    return expect(
      this.rssParser.parseGuid({guid: ['https://test.com/article']})
    ).to.deep.equals('https://test.com/article')
  })

  it('should parse guid with perma link attribute', () => {
    return expect(
      this.rssParser.parseGuid({guid: [{'_': 'abcd12345', isPermaLink: true}]})
    ).to.deep.equals('abcd12345')
  })
})
