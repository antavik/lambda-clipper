const { StatusCodes, getReasonPhrase } = require("http-status-codes")
const axios = require("axios")
const Readability = require("@mozilla/readability")
const JSDOM = require("jsdom")

const TOKEN = process.env["TOKEN"]


async function main(args) {
  const userId = args.__ow_headers["x-user-id"]
  if (!userId) {
    return {
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: {message: "user id header required"}
      }
    }
  }
  if (userId !== TOKEN) {
    return {
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: {message: "invalid user id"}
      }
    }
  }

  const url = args["url"]

  const response = await axios.get(
    url,
    headers={
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0"
    }
  );

  if (response.status !== 200) {
    return {
      error: {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {message: "could not get url content"}
      }
    }
  }

  console.log(response.data)

  let doc = new JSDOM(response.data)
  let reader = new Readability(doc.window.document)
  let article = reader.parse()

  console.log(article)

  return {"body": article}
}

exports.main = main