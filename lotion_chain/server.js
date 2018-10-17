const { connect } = require('lotion');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');

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
        if (tx) await send(tx);
        ctx.body = await getState();
      } else {
        ctx.body = 'OK';
      }
    }
  });

  app.listen(3000);

}

module.exports = server;
