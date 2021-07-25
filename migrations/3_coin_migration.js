const MyCoin = artifacts.require("MyCoin");

module.exports = async function (deployer) {
    await deployer.deploy(MyCoin);
    let tokenInstance = await MyCoin.deployed();
    console.log(tokenInstance);
};
