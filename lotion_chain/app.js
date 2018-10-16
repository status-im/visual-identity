const lotion = require('lotion');
const server = require('./server.js');
const initialState = require('./initialState.js');
const { canvasLinesHandler } = require('./handlers.js');

let app = lotion({
  initialState,
  devMode: true,       // set this true to wipe blockchain data between runs
  //keyPath: './privkey.json',
  keys: 'privkey.json',
  //genesisPath: '/Users/Barry/.lotion/networks/1b709c688fe0156e212afb6c551ef900/config/genesis.json',          // path to genesis.json. generates new one if not specified.
  //peers: [],            // array of '<host>:<p2pport>' of initial tendermint nodes to connect to. does automatic peer discovery if not specified.
  //logTendermint: true, // if true, shows all output from the underlying tendermint process
  //p2pPort: 46658,       // port to use for tendermint peer connections
  tendermintPort: 46657 // port to use for tendermint rpc
})

app.use(canvasLinesHandler);

app.start().then((info) => {
  console.log(info);
  setTimeout(() => { server(info.GCI) }, 1000);
})
