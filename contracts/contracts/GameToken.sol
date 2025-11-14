// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameToken
 * @dev ERC20 token for the Jump Obstacle Game rewards system
 */
contract GameToken is ERC20, Ownable {
    /// @dev Maximum supply of tokens (100 million with 18 decimals)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    
    /// @dev Address of the game rewards contract
    address public gameRewardsContract;
    
    event GameRewardsContractUpdated(address indexed newContract);
    event TokensMinted(address indexed to, uint256 amount);
    
    constructor(address initialOwner) ERC20("Jump Game Token", "JUMP") Ownable(initialOwner) {
        // Mint initial supply to owner for distribution
        _mint(initialOwner, 10_000_000 * 10**18); // 10 million initial supply
    }
    
    /**
     * @dev Sets the game rewards contract address
     * @param _gameRewardsContract Address of the GameRewards contract
     */
    function setGameRewardsContract(address _gameRewardsContract) external onlyOwner {
        require(_gameRewardsContract != address(0), "Invalid address");
        gameRewardsContract = _gameRewardsContract;
        emit GameRewardsContractUpdated(_gameRewardsContract);
    }
    
    /**
     * @dev Mints new tokens to a specified address
     * @param to Address to receive the tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burns tokens from the caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}

