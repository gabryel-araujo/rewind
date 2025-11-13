import { env } from "src/common/env";

const { host, protocol } = new URL(env.R2_ENDPOINT)

console.log(`${protocol}//rewind.${host}`)
