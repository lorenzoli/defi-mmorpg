pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NftMmorpg is ERC721, Ownable {
    struct Character {
        string name;
        uint8 damage;
        uint8 magic;
    }

    mapping(uint256 => Character) private _characters;
    uint256 nextId = 0;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function mint(
        string memory name,
        uint8 dmg,
        uint8 magic
    ) public {
        _safeMint(msg.sender, nextId);
        _characters[nextId] = Character(name, dmg, magic);
        nextId++;
    }

    function getCharacter(uint256 id) public view returns (Character memory) {
        return _characters[id];
    }
}
