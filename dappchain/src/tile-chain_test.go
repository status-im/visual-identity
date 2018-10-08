package main

import (
	"testing"

	loom "github.com/loomnetwork/go-loom"
	"github.com/loomnetwork/go-loom/plugin"
	"github.com/loomnetwork/go-loom/plugin/contractpb"
	"types"
)

const payload = `{
  "linesArray": [
{
    "color": "#444",
    "size": 1,
    "startX": 71.9140625,
    "startY": 44.4296875,
    "endX": 72.9140625,
    "endY": 45.4296875,
    "pixels": [
      [
        71,
        44
      ],
      [
        71,
        45
      ],
      [
        72,
        44
      ],
      [
        72,
        45
      ]
    ]
  },
  {
    "color": "#444",
    "size": 1,
    "startX": 72.9140625,
    "startY": 45.4296875,
    "endX": 72.9140625,
    "endY": 54.6796875,
    "pixels": [
      [
        72,
        45
      ],
      [
        72,
        46
      ],
      [
        72,
        47
      ],
      [
        72,
        48
      ]
    ]
  }
  ]
}
	`

var ParsedPayload = &PixelMapState{
	LinesArray: []TileMapLine{
		{"#444", 1, 71.9140625, 44.4296875, 72.9140625, 45.4296875,
			Pixels{[2]int16{71, 44}, [2]int16{71, 45}, [2]int16{72, 44}, [2]int16{72, 45}}},
		{"#444", 1, 72.9140625, 45.4296875, 72.9140625, 54.6796875,
			Pixels{[2]int16{72, 45}, [2]int16{72, 46}, [2]int16{72, 47}, [2]int16{72, 48}}},
	},
}

func GetFirstPixels(s *PixelMapState) [2]int16 {
	return s.LinesArray[0].Pixels[0]
}

func TestStateJSON(t *testing.T) {
	tc := &TileChain{}
	expected := &PixelMapState{
		LinesArray: []TileMapLine{
			{"#444", 1, 71.9140625, 44.4296875, 72.9140625, 45.4296875,
				Pixels{[2]int16{71, 44}, [2]int16{71, 45}, [2]int16{72, 44}, [2]int16{72, 45}}},
			{"#444", 1, 72.9140625, 45.4296875, 72.9140625, 54.6796875,
				Pixels{[2]int16{72, 45}, [2]int16{72, 46}, [2]int16{72, 47}, [2]int16{72, 48}}},
		},
	}
	state, err := tc.parseStateJSON(payload)
	if err != nil {
		t.Fatalf("expected nil err")
	}
	if state.Width != expected.Width {
		t.Fatalf("wrong width: expected %v, got %v", expected.Width, state.Width)
	}
	if state.Height != expected.Height {
		t.Fatalf("wrong height: expected %v, got %v", expected.Height, state.Height)
	}
	if GetFirstPixels(state) != GetFirstPixels(expected) {
		GetFirstPixels(state)
		t.Fatalf("wrong pixel: expected %v, got %v", GetFirstPixels(expected), GetFirstPixels(state))
	}
	// TODO: add proper struct check
}

func TestSetTileMapState(t *testing.T) {
	tc := &TileChain{}
	tx := &types.TileMapTx{
		Data: payload,
	}
	addr1 := loom.MustParseAddress("chain:0xb16a379ec18d4093666f8f38b11a3071c920207d")
	ctx := contractpb.WrapPluginContext(plugin.CreateFakeContext(addr1, addr1))
	err := tc.SetTileMapState(ctx, tx)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	parsedState, err2 := tc.getState(ctx)
	if err2 != nil {
		t.Errorf("Error: %v", err2)
	}
	if GetFirstPixels(parsedState) != GetFirstPixels(ParsedPayload) {
		t.Fatalf("wrong pixel: expected %v, got %v", GetFirstPixels(ParsedPayload), GetFirstPixels(parsedState))
	}
}

func TestSimpleSetAndGet(t *testing.T) {
	addr1 := loom.MustParseAddress("chain:0xb16a379ec18d4093666f8f38b11a3071c920207d")
	ctx := contractpb.WrapPluginContext(plugin.CreateFakeContext(addr1, addr1))
	ctxState := &types.TileMapState{
		Data: "teststring",
	}
	err := ctx.Set([]byte("TileMapState"), ctxState)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	var curState types.TileMapState
	err = ctx.Get([]byte("TileMapState"), &curState)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	if curState.Data != ctxState.Data {
		t.Fatalf("Data does not match: expected %v, got %v", ctxState.Data, curState.Data)
	}
}

func TestUnmarshalJSONtoProtoBuf(t *testing.T) {
	tc := &TileChain{}
	addr1 := loom.MustParseAddress("chain:0xb16a379ec18d4093666f8f38b11a3071c920207d")
	ctx := contractpb.WrapPluginContext(plugin.CreateFakeContext(addr1, addr1))
	state, err := tc.JSONtoPixelMap(payload)
	err = ctx.Set([]byte("PixelMapState"), state)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
}
