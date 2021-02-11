import resolve from "@rollup/plugin-node-resolve"
import serve from "rollup-plugin-serve"
import json from "@rollup/plugin-json"
import commonjs from "@rollup/plugin-commonjs"
import postcss from "rollup-plugin-postcss"
import { terser } from "rollup-plugin-terser" // eslint-disable-line no-unused-vars
import license from "rollup-plugin-license"

const dev = process.env.ROLLUP_WATCH // eslint-disable-line no-undef

const servopts = {
  contentBase: "./dist",
  host: "0.0.0.0",
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
}

export default {
  input: ["src/ll_notify.js"],
  output: {
    dir: "./dist",
    format: "es",
  },
  plugins: [
    license({
      banner:
        "@license: Includes: alertifyjs - Mohammad Younes <Mohammad@alertifyjs.com> (http://alertifyjs.com)",
    }),
    resolve({
      preferBuiltins: true,
    }),
    json(),
    postcss({
      plugins: [],
    }),
    commonjs({
      esmExternals: true,
      transformMixedEsModules: true,
    }),
    dev && serve(servopts),
    !dev &&
      terser({
        output: {
          comments: function (node, comment) {
            return /@license/i.test(comment.value)
          },
        },
      }),
  ],
}
