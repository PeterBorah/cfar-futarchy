var DAO = artifacts.require('./dao.sol');

contract('dao', function(accounts){
    it("should create a proposal",function() {
        var dao;
        var address;
        return DAO.new().then(function(instance) { dao = instance}). 
        then(function() {return dao.createProposal("raise minimum wage");}).
        then(function(result) { address = result}). 
        then(function(){ return dao.getProposals.call()}). 
        then(function(result) {
            //console.log(result[0]);
            //console.log(address);
            //assert.equal(result[0], address);
            assert.equal(result.length, 1);
        });
    });
  it("should return the right proposal by desc", function() {
      var dao;
      var normalProp;
        return DAO.new().then(function(instance) { dao = instance}). 
        then(function() {return dao.createProposal("raise minimum wage")}).
        then(function() {return dao.createProposal("legalize marijuana in texas")}). 
        then(function(){ return dao.getProposals.call()}). 
        then(function(result) {
            normalProp = result[0];
        }). 
        then(function() {return dao.getProposalByDesc.call("raise minimum wage")}). 
        then(function(result) {
            assert.equal(result, normalProp);
        });
  });  
});