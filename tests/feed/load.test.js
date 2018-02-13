const chai = require('chai')
const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
const chaiAsPromised = require('chai-as-promised')
const Feed = require('../../src/index')

const expect = chai.expect
sinonStubPromise(sinon)
chai.use(chaiAsPromised)

describe('Feed.load', () => {

  beforeEach(() => {
    this.feed = new Feed()

    this.sendRequestStub = sinon.stub(this.feed, 'sendRequest')
    this.parseXmlToJsonStub = sinon.stub(this.feed, 'parseXmlToJson')
    this.parseFeedStub = sinon.stub(this.feed, 'parseFeed')
  })


  afterEach(() => {
    this.sendRequestStub.restore()
    this.parseXmlToJsonStub.restore()
    this.parseFeedStub.restore()
  })


  it('should successfully load source', () => {
    this.sendRequestStub.returnsPromise().resolves({xml: '<xml><rss><channel></channel></rss></xml>'})
    this.parseXmlToJsonStub.returnsPromise().resolves({rss: {channel: []}})
    this.parseFeedStub.returnsPromise().resolves({title: 'Test channel', items: []})

    const result = this.feed.load('https://domain.com/mrss/')
    return expect(result).to.eventually.deep.equal({title: 'Test channel', items: []})
  })


  it('should be rejected when loading source', () => {
    this.sendRequestStub.returnsPromise().rejects('Some error probably timeout')

    const result = this.feed.load('https://domain.com/mrss/')
    return expect(result).to.be.rejectedWith('Some error probably timeout')
  })


  it('should be rejected when parsing xml to json', () => {
    this.sendRequestStub.returnsPromise().resolves({xml: '<xml><rss><channel></channel></rss></xml>'})
    this.parseXmlToJsonStub.returnsPromise().rejects('Some error probably invalid xml')

    const result = this.feed.load('https://domain.com/mrss/')
    return expect(result).to.be.rejectedWith('Some error probably invalid xml')
  })


  it('should be rejected when parsing json to feed', () => {
    this.sendRequestStub.returnsPromise().resolves({xml: '<xml><rss><channel></channel></rss></xml>'})
    this.parseXmlToJsonStub.returnsPromise().resolves({rss: {channel: []}})
    this.parseFeedStub.returnsPromise().rejects('Some error probably unknown parser')

    const result = this.feed.load('https://domain.com/mrss/')
    return expect(result).to.be.rejectedWith('Some error probably unknown parser')
  })
})
