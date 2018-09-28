package main

import (
	"encoding/json"
	"fmt"

	"types"

	"github.com/loomnetwork/go-loom/plugin"
	contract "github.com/loomnetwork/go-loom/plugin/contractpb"
)

func main() {
	plugin.Serve(Contract)
}

// Lines is the representation of the client payload
// type pixels [][]int16
// type Line struct {
// 	color  string
// 	startX float64
// 	endX   float64
// 	startY float64
// 	endY   float64
// 	size   int
// 	pixels pixels
// }
// type Lines []Line

type TileChain struct {
}

func (e *TileChain) Meta() (plugin.Meta, error) {
	return plugin.Meta{
		Name:    "TileChain",
		Version: "0.0.1",
	}, nil
}

func (e *TileChain) Init(ctx contract.Context, req *plugin.Request) error {
	return nil
}

func (e *TileChain) GetTileMapState(ctx contract.StaticContext, _ *types.TileMapTx) (*types.TileMapState, error) {
	var curState types.TileMapState
	err := ctx.Get([]byte("TileMapState"), &curState)
	if err != nil && err != contract.ErrNotFound {
		return nil, err
	}
	return &curState, nil
}

func (e *TileChain) SetTileMapState(ctx contract.Context, tileMapTx *types.TileMapTx) error {
	payload := tileMapTx.GetData()
	if err := e.setState(ctx, payload); err != nil {
		fmt.Printf("setState failed: %v\n", err)
		return fmt.Errorf("set state: %v", err)
	}

	if err := e.emitTileMapStateUpdate(ctx, payload); err != nil {
		fmt.Printf("Failed to emit message: %v\n", err)
		return fmt.Errorf("emit update message: %v", err)
	}

	return nil
}

// TileMapState represents canvas state data as passed from JS client.
type TileMapState struct {
	Width      int           `json:"width"`
	Height     int           `json:"height"`
	LinesArray []TileMapLine `json:"linesArray"`
}

// TileMapLine represents single line info from client JSON.
type TileMapLine struct {
	Color  string  `json:"color"`
	Size   int     `json:"size"`
	StartX float64 `json:"startX"`
	StartY float64 `json:"startY"`
	EndX   float64 `json:"endX"`
	EndY   float64 `json:"endY"`
	Pixels Pixels  `json:"pixels"`
}

type Pixels [][2]int16

func (e *TileChain) setState(ctx contract.Context, payload string) error {
	state, err := e.parseStateJSON(payload)
	if err != nil {
		return err
	}

	e.handleState(state)

	ctxState := &types.TileMapState{
		Data: "???",
	}

	key := []byte("TileMapState")
	err = ctx.Set(key, ctxState)
	if err != nil {
		return fmt.Errorf("context.Set: %v", err)
	}

	return nil
}

func (e *TileChain) parseStateJSON(payload string) (*TileMapState, error) {
	var state TileMapState
	err := json.Unmarshal([]byte(payload), &state)
	if err != nil {
		return nil, fmt.Errorf("json unmarshal: %v", err)
	}
	return &state, nil
}

func (e *TileChain) emitTileMapStateUpdate(ctx contract.Context, payload string) error {
	emitMsg := struct {
		Data   string
		Method string
	}{payload, "onTileMapStateUpdate"}

	msg, err := json.Marshal(emitMsg)
	if err != nil {
		return fmt.Errorf("json marshal: %v", err)
	}

	ctx.Emit(msg)
	return nil
}

func (e *TileChain) handleState(state *TileMapState) error {
	return fmt.Errorf("TBD")
}

var Contract plugin.Contract = contract.MakePluginContract(&TileChain{})
