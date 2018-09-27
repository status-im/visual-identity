package main

import "testing"

func TestStateJSON(t *testing.T) {
	tc := &TileChain{}
	payload := `{
  "width": 320,
  "height": 240,
  "linesArray": [
    {"color": "red", "size": 1, "startX": 1.2, "endX": 2.2},
    {"color": "green", "size": 1, "startX": 1.3, "endX": 2.3},
    {"color": "blue", "size": 1, "startX": 1.4, "endX": 2.4}
  ]
}
	`
	expected := &TileMapState{
		Width:  320,
		Height: 240,
		LinesArray: []TileMapLine{
			{"red", 1, 1.2, 2.2},
			{"green", 1, 1.3, 2.2},
			{"blue", 1, 1.4, 2.4},
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
	// TODO: add proper struct check
}
