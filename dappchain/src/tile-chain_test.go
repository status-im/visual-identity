package main

import "testing"

func TestStateJSON(t *testing.T) {
	tc := &TileChain{}
	payload := `{
  "width": 320,
  "height": 240,
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
	expected := &TileMapState{
		Width:  320,
		Height: 240,
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
	// TODO: add proper struct check
}
