let { connect } = require('lotion')
let GCI = "ce24d095c4ca556c3960148f76e0caf06750c88923f650c9c6e13cd434044e75"

async function main() {
  let { state, send } = await connect(GCI)
  console.log(await state) // { count: 0 }
  console.log(await send({ nonce: 0, bob: 'is cool' })) // { ok: true }
  console.log(await state) // { count: 1 }
}

main()
