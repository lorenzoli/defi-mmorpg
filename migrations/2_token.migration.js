const NftMmorpg = artifacts.require("NftMmorpg");

module.exports = async function (deployer) {
    await deployer.deploy(NftMmorpg, "NFT MMORPG", "NFTMMORPG");
    let tokenInstance = await NftMmorpg.deployed();
    console.log(tokenInstance);
};
