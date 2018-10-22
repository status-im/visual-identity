const { connect } = require('lotion');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const { verifySignedMessage, verifySignedTx, createSideChainAccount } = require('./utils/signing.js');

const app = new Koa();
app.use(bodyParser());
app.use(compress());

async function server (GCI) {
  let { state, send, getState } = await connect(GCI)
  app.use(async ctx => {
    if (ctx.request.url === '/canvas') {
      let currentState = await state.canvasLines;
      ctx.body = currentState;
    }

    if (ctx.request.url === '/addLines') {
      if (ctx.request.method === 'POST') {
        const tx = ctx.request.body;
        if (tx) {
          const result = await send(tx);
          ctx.body = result;
        } else {
          ctx.body = 'No TX Supplied';
        }
      } else {
        ctx.body = 'OK';
      }
    }

    if (ctx.request.url === '/newAccount') {
      if (ctx.request.method === 'POST') {
        const tx = ctx.request.body;
        //TODO create chain handler
        if (tx) await send(tx);
        ctx.body = 'OK';
      } else {
        ctx.body = 'OK';
      }
    }

  });

  app.listen(3000);

}

module.exports = server;
