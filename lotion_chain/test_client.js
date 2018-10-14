let { connect } = require('lotion')
let GCI = "b17f1587c34da4612665e06502e78bde3d81b75ed57b851ca860eff0b8e650d0"

async function main() {
  let { state, send } = await connect(GCI)
  console.log(await state) // { count: 0 }
  console.log(await send({ nonce: 0, bob: 'is cool' })) // { ok: true }
  console.log(await state) // { count: 1 }
}

main()
