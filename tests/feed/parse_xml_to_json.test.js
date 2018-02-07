const sinon = require('sinon')
const chai = require('chai')
const sinonStubPromise = require('sinon-stub-promise')
const chaiAsPromised = require('chai-as-promised')
const Feed = require('../../src/index')

const expect = chai.expect
sinonStubPromise(sinon)
chai.use(chaiAsPromised)

describe('Feed.parseXmlToJson', () => {

  beforeEach(() => {
    this.feed = new Feed()
  })


  it('should successfully parse xml to json', () => {
    const xmlParserStub = sinon.stub(this.feed.xmlParser, 'parseString')
    xmlParserStub.callsArgWith(1, null, {data: ['OK']})

    const result = this.feed.parseXmlToJson('<xml><data>OK</data></xml>')
    xmlParserStub.restore()
    return expect(result).to.eventually.deep.equals({data: ['OK']})
  })


  it('should be rejected when parsing xml to json', () => {
    const xmlParserStub = sinon.stub(this.feed.xmlParser, 'parseString')
    xmlParserStub.callsArgWith(1, new Error('Some error'))

    const result = this.feed.parseXmlToJson('this is not a valid xml')
    xmlParserStub.restore()
    return expect(result).to.be.rejectedWith('Some error')
  })
});