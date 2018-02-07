const chai = require('chai')
const sinon = require('sinon')
const sinonStubPromise = require('sinon-stub-promise')
const chaiAsPromised = require('chai-as-promised')
const Feed = require('../../src/index')

const expect = chai.expect
sinonStubPromise(sinon)
chai.use(chaiAsPromised)

describe('Feed.sendRequest', () => {

  beforeEach(() => {
    this.feed = new Feed()
  })


  it('should successfully send request', () => {
    const requestGetStub = sinon.stub(this.feed.request, 'get')
    requestGetStub.callsArgWith(1, null, {statusCode: 200}, '<xml></xml>')

    const result = this.feed.sendRequest({url: 'https://test.com'})
    requestGetStub.restore()
    return expect(result).to.eventually.deep.equals({response: {statusCode: 200}, xml: '<xml></xml>'})
  })


  it('should be rejected when sending request', () => {
    const requestGetStub = sinon.stub(this.feed.request, 'get')
    requestGetStub.callsArgWith(1, new Error('Some error'))

    const result = this.feed.sendRequest({url: 'https://invalid-url.com'})
    requestGetStub.restore()
    return expect(result).to.be.rejectedWith('Some error')
  })
})
