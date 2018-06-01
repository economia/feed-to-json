const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.parseItems', () => {

  before(() => {
    this.rssParser = new RssParser()
  })

  it('should parse array of categories', () => {
    return expect(
      this.rssParser.parseCategories({category: ['test', 'abcd', {'_': 'xyzq', domain: 'https://test.com/tag'}]})
    ).to.deep.equals(['test', 'abcd', 'xyzq'])
  })
})