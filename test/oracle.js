var oracle = artifacts.require('./oracle.sol');

contract('Oracle',function(accounts){
    it("should create an oracle with an initial utility", function() {
        var dao;

        return oracle.new(20).then(function(instance) { dao = instance}).
        then(function() {return dao.getUtility.call()}).
        then(function(result) {
            console.log(result);
            assert.equal(result, 20);
        });
    });

    it("should update utility to desired amount", function(){
        var dao;

        return oracle.new(20).then(function(instance) {dao = instance}).
        then(function() {return dao.updateUtility(30)}).
        then(function() {return dao.getUtility.call()}).
        then(function(result) {
            console.log(result);
            assert.equal(result, 30);
        });
    });

    it("should return false if utility is greater than 100", function() {
        var dao;
        return oracle.new(20).then(function(instance){ dao = instance}).
        then(function() {return dao.updateUtility(120)}).
        then(function() {return dao.getUtility.call()}).
        then(function(result) {
            console.log(result);
            assert.equal(result, 20);
        });
    });
});
