const axios = require('axios')
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
    const axiosStub = sinon.stub(axios, 'get')
    axiosStub.returnsPromise().resolves({data: '<xml></xml>'})

    const result = this.feed.sendRequest('https://test.com')

    return expect(result).to.eventually.deep.equals({data: '<xml></xml>'})
  })
})
