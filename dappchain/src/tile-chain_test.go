package main

import "testing"

func GetFirstPixels(s *TileMapState) [2]int16 {
	return s.LinesArray[0].Pixels[0]
}

func TestStateJSON(t *testing.T) {
	tc := &TileChain{}
	payload := `{
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
