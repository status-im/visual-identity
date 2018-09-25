package main

import (
	"io/ioutil"
	"math/big"
	"strconv"
	"strings"
	"errors"

	"github.com/loomnetwork/go-loom/plugin"
	contract "github.com/loomnetwork/go-loom/plugin/contractpb"
)

func main() {
	plugin.Serve(Contract)
}

type Canvas struct {
}

func (c *Canvas) Meta() (plugin.Meta, error) {
	return plugin.Meta{
		Name:    "Canvas",
		Version: "0.0.1",
	}, nil
}

func (c *Canvas) Init(ctx contract.Context, req *plugin.Request) error {
	return nil
}

// TODO: constructor

// TODO: getters for public variables

// TODO: addFunds(uint amount) public
func (c *Canvas) AddFunds(ctx contractpb.Context, value *types.Funds) error {
	sntAddr, err := ctx.Resolve("SNTDappChain")
	if err != nil {
		return err
	}
	sntData, err := ioutil.ReadFile("SNTDappChain.abi")
	if err != nil {
		return err
	}
	abiSnt, err := abi.JSON(strings.NewReader(string(sntData)))
	if err != nil {
		return err
	}

	senderAddr := []byte(ctx.Message().Sender.Local)

	canvasAddr, err := ctx.Resolve("Canvas")
	if err != nil {
		return err
	}

	// require(token.transferFrom(msg.sender, address(this), amount));
	// ================================================================
	input, err := abiSnt.Pack("transferFrom", senderAddr, canvasAddr, big.NewInt(value.Amount))
	if err != nil {
		return err
	}
	evmOut := []byte{}
	err = contractpb.CallEVM(ctx, sntAddr, input, &evmOut)
	if err != nil {
		return err
	}
	value, err := strconv.ParseBool(evmOut)
	if !value {
		return errors.New("Transfer failed")
	}
	// ****************************************************************

	// token.approve(msg.sender, amount);
	// ================================================================
	input, err := abiSnt.Pack("approve", senderAddr, big.NewInt(value.Amount))
	if err != nil {
		return err
	}
	evmOut := []byte{}
	err = contractpb.CallEVM(ctx, sntAddr, input, &evmOut)
	if err != nil {
		return err
	}

	/*
		TODO: balances[msg.sender] += amount;
	*/
}

// TODO: withdrawFunds(uint amount) public

// TODO: draw(uint x, uint y, uint shapeIndex, uint priceIfEmpty) public
func (c *Canvas) AddFunds(ctx contractpb.Context, value *types.Drawing) error {
{
	// require(x < 350 && y < 350, "Invalid coordinate");
	if value.X >= 350 || value.Y >= 350 {
		return errors.New("Invalid coordinate")
	}

	senderAddr := []byte(ctx.Message().Sender.Local)  // msg.sender

	

//     Pixel storage p = grid[x][y];
//     if(p.owner == msg.sender) return;
//     if(p.owner == address(0)){
//         // Empty pixel
//         require(balances[msg.sender] >= priceIfEmpty, "Not enough balance. Add more funds");
//         balances[msg.sender] -= priceIfEmpty;
//         publicBalance += priceIfEmpty;
//         p.price = priceIfEmpty;
//     } else {
//         // Pixel is owned
//         require(balances[msg.sender] >= p.price, "Not enough balance. Add more funds");
//         balances[msg.sender] -= p.price;
//         balances[p.owner] += p.price;
//         playerAmountToTax[p.owner] -= p.price;
//     }
//     p.lastPriceUpdate = 0; // New owner can change the price now
//     p.owner = msg.sender;
//     p.shapeIndex = shapeIndex;
//     playerPixelsX[msg.sender].push(x);
//     playerPixelsY[msg.sender].push(y);
//     playerAmountToTax[msg.sender] += p.price;
//     emit PixelDrawn(msg.sender, x, y, p.price);
// }

}

// TODO: leaveTheGame() public

// TODO: canApplyTax() public view returns(bool)

// TODO: calculateTax(uint x, uint y) public view returns(uint)

// TODO:  tax() public onlyController

// TODO:  price(uint x, uint y) public view returns(uint)

// TODO: canUpdatePrice(uint x, uint y) public view returns(bool)

// TODO: setPrice(uint x, uint y, uint newPrice) public

// TODO: gameOver() public onlyController

// TODO: setPriceUpdatePeriod(uint newPeriod) public onlyController

// TODO: setTaxPeriod(uint newPeriod) public onlyController

// TODO: setTaxPercentage(uint newPercentage) public onlyController

var Contract plugin.Contract = contract.MakePluginContract(&Canvas{})
