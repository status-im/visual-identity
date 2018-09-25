pragma solidity ^0.4.24;

import "../token/ERC20Token.sol";
import "../common/Controlled.sol";

contract Canvas is Controlled {

    struct Shape {
        bytes6 color;
        // TODO: add missing properties
    }

    struct Pixel {
        address owner;
        uint price;
        uint shapeIndex;
        uint lastPriceUpdate;
    }

    uint public constant GRID_X = 5;
    uint public constant GRID_Y = 5;

    mapping(bytes32 => Pixel) public grid;

    Shape[] public shapes;

    ERC20Token public token;

    uint public publicBalance = 0;
    
    mapping(address => uint) public balances;

    address[] public players;

    mapping(address => uint) public playerIndex;
    mapping(address => uint) public playerAmountToTax;
    mapping(address => bytes32[]) public playerPixels;



    uint public priceUpdatePeriod = 2 hours; // How long until the price of a pixel can be updated
    
    uint public lastTax;
    uint public taxPeriod = 30 minutes; // How much time between taxes
    uint public taxPercentage = 10;

    constructor(address _token) public {
        token = ERC20Token(_token);
        players.push(address(0));
    }


    /// @notice Add funds to your balance. Tax will be deducted from these funds
    function addFunds(uint amount) public {
        require(token.allowance(msg.sender, address(this)) >= amount, "Allowance isn't set");
        require(token.transferFrom(msg.sender, address(this), amount), "Couldn't transfer funds");
        token.approve(msg.sender, amount); 
        balances[msg.sender] += amount;
        
        if(playerIndex[msg.sender] == 0 ){
            uint idx = players.push(msg.sender) - 1;
            playerIndex[msg.sender] = idx;
        }
    }

    /// @notice Withdraw funds from your balance
    function withdrawFunds(uint amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] - amount <= balances[msg.sender], "Amount to withdraw must not be greater than balance");
        balances[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Couldn't transfer funds");
    }


    function draw(bytes32[] coordinates, uint shapeIndex, uint priceIfEmpty) public {        
        uint cost = 0;
        for(uint i = 0; i < coordinates.length; i++){
            Pixel storage p = grid[coordinates[i]];
            if(p.owner == msg.sender) continue;

            if(p.owner == address(0)){
                // Empty pixel
                cost += priceIfEmpty;               
                publicBalance += priceIfEmpty;
                p.price = priceIfEmpty;
            } else {
                // Pixel is owned
                cost += p.price;
                balances[p.owner] += p.price;
                playerAmountToTax[p.owner] -= p.price;
            }

            p.lastPriceUpdate = 0; // New owner can change the price now
            p.owner = msg.sender;
            p.shapeIndex = shapeIndex;
            playerPixels[msg.sender].push(coordinates[i]);
        }

        require(balances[msg.sender] >= cost, "Not enough balance. Add more funds");

        playerAmountToTax[msg.sender] += cost;
        balances[msg.sender] -= cost;
    }


    function canApplyTax() public view returns(bool){
        return lastTax + taxPeriod < block.timestamp;
    }
    
    
    function calculateTax(bytes32 coordinate) public view returns(uint){
        Pixel storage p = grid[coordinate];
        return p.price * taxPercentage / 100;
    }

    function tax() public onlyController {
        if(lastTax + taxPeriod > block.timestamp) return;

        lastTax = block.timestamp;

        // TODO: check performance
        for(uint i = 1; i < players.length; i++){
            uint taxAmount = playerAmountToTax[players[i]] * taxPercentage / 100;
            if(balances[players[i]] < taxAmount){
                // If you ain't got enough money for your pixels, you lose everything :(
                for(uint j = 0; j < playerPixels[players[i]].length; j++){
                    bytes32 coordinate = playerPixels[players[i]][j];

                    if(grid[coordinate].owner == players[i]){
                        grid[coordinate].owner = address(0);
                        grid[coordinate].price = 0;
                        grid[coordinate].lastPriceUpdate = 0;

                        delete playerPixels[players[i]];
                    }
                }
            } else {
                balances[msg.sender] -= taxAmount;
                publicBalance += taxAmount;
            }
        }

        
        emit TaxApplied(block.timestamp);
    }


    /// @notice View the price of a pixel
    /// @notice View the price of a pixel
    function price(bytes32 coordinate) public view returns(uint){
        Pixel storage p = grid[coordinate];
        return p.price;
    }


    /// @notice Determine if you can update the price of a pixel
    function canUpdatePrice(bytes32 coordinate) public view returns(bool){
        Pixel storage p = grid[coordinate];

        require(p.owner == msg.sender, "You're not the owner of this pixel");

        return p.lastPriceUpdate + priceUpdatePeriod < block.timestamp;
    }


    /// @notice Set the price of a pixel
    function setPrice(uint x, uint y, uint newPrice) public {
        require(x < 350 && y < 350, "Invalid coordinate");

        bytes32 coordinate = keccak256(abi.encodePacked(x, y));
        Pixel storage p = grid[coordinate];

        require(p.owner == msg.sender, "You're not the owner of this pixel");
        require(p.lastPriceUpdate + priceUpdatePeriod < block.timestamp, "You cannot update the price yet");

        playerAmountToTax[msg.sender] -= p.price;
        playerAmountToTax[msg.sender] += newPrice;

        p.price = newPrice;
        p.lastPriceUpdate = block.timestamp;

        emit PixelPriceUpdated(coordinate, newPrice);
    }


    /// @notice After the hackathon ends, we return the SNT balances available to users 
    function gameOver() public onlyController {
        // TODO: check performance. Shouldn't matter in a sidechain, I guess
        for(uint i = 0; i < players.length; i++){
            uint amount = balances[players[i]];
            balances[players[i]] = 0;
            token.transferFrom(address(this), players[i], amount);
        }

        uint controllerAmount = balances[controller];
        balances[controller] = 0;
        token.transferFrom(address(this), controller, controllerAmount);

        selfdestruct(controller);
    }


    function setPriceUpdatePeriod(uint newPeriod) public onlyController {
        priceUpdatePeriod = newPeriod;
    }


    function setTaxPeriod(uint newPeriod) public onlyController {
        taxPeriod = newPeriod;
    }


    function setTaxPercentage(uint newPercentage) public onlyController {
        taxPercentage = newPercentage;
    }

    event PixelDrawn(address owner, bytes32 coordinate, uint price);
    event PixelPriceUpdated(bytes32 coordinate, uint newPrice);
    event TaxApplied(uint timestamp);
}
