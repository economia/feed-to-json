const chai = require('chai')
const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
const chaiAsPromised = require('chai-as-promised')
const Feed = require('../../src/index')
const RssParser = require('../../src/parsers/RssParser')

const expect = chai.expect
sinonStubPromise(sinon)
chai.use(chaiAsPromised)

describe('Feed.parseFeed', () => {

  beforeEach(() => {
    this.feed = new Feed()
  })


  it('should successfully parse rss feed', () => {
    const rssParserStub = sinon.stub(RssParser.prototype, 'parse').returns({title: 'Test'})

    const result = this.feed.parseFeed({rss: {channel: ['OK']}})
    rssParserStub.restore()
    return expect(result).to.eventually.deep.equals({title: 'Test'})
  })


  it('should be rejected because format does not have a parser', () => {
    const result = this.feed.parseFeed({data: []})

    return expect(result).to.be.rejectedWith('Unknown feed type')
  })
})
