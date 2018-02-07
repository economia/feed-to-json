const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.extractAttribute', () => {

  before(() => {
    this.rssParser = new RssParser()
    this.input = {title: ['Lorem'], name: ['ipsum']}
  })


  it('should extract attribute', () => {
    const result = this.rssParser.extractAttribute('name', this.input)
    return expect(result).to.equals('ipsum')
  })


  it('should not extract attribute', () => {
    const result = this.rssParser.extractAttribute('description', this.input)
    return expect(result).to.equals(undefined)
  })
})