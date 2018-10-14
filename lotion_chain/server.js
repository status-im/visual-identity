const { connect } = require('lotion');
const Koa = require('koa');
const app = new Koa();

async function server (GCI) {
  const { state, send } = await connect(GCI)
  app.use(async ctx => {
    if (ctx.request.url === '/state') {
      const currentState = await state;
      ctx.body = currentState;
    }

    if (ctx.request.url === '/tx') {
      console.log(ctx.header.newcount);
      const value = ctx.header.newcount
      await send({ value })
      ctx.body = await state;
    }

  });


  app.listen(3000);

}

module.exports = server;
