const { StatusCodes, getReasonPhrase } = require("http-status-codes")
const axios = require("axios")


async function main(args) {
  const url = args["url"]

  const response = await axios.get(
    url,
    headers={
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0"
    }
  );

  if (response.code != 200) {
    return {
      error: {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {message: "could not get url content"}
      }
    }
  }

  var article = new Readability(response.data).parse()

  return {"body": article}
}

exports.main = main