const chai = require('chai')
const RssParser = require('../../../src/parsers/RssParser')

const expect = chai.expect

describe('Parsers.RssParser.extractStructure', () => {

  before(() => {
    this.rssParser = new RssParser()
  })


  it('should extract structure', () => {
    const result = this.rssParser.extractStructure(
      ['title', {target: 'name', as: 'text'}],
      {
        title: ['Lorem'],
        name: ['ipsum']
      }
    )
    return expect(result).to.deep.equals({
      title: 'Lorem',
      text: 'ipsum'
    })
  })
})