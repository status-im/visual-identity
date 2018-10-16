const { connect } = require('lotion');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser());

async function server (GCI) {
  let { state, send, getState } = await connect(GCI)
  app.use(async ctx => {
    if (ctx.request.url === '/state') {
      let currentState = await getState();
      console.log({currentState});
      ctx.body = currentState;
    }

    if (ctx.request.url === '/addLines') {
      //console.log(ctx);
      //console.log('body', ctx.request.body);
      let { canvasLines } = ctx.request.body;
      if (canvasLines) await send({ canvasLines });
      ctx.body = await getState();
    }

  });

  app.listen(3000);

}

module.exports = server;