const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
const axios = require("axios");

const USER_TOKEN = process.env["USER_TOKEN"];
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0";

const TIMEOUT = 1000 * 5;


async function main(args) {
  const userId = args.__ow_headers["x-user-id"];
  if (!userId) {
    return {
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: { message: "user id header required" }
      }
    }
  }
  if (userId !== USER_TOKEN) {
    return {
      error: {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: { message: "invalid user id" }
      }
    }
  }

  var config = {
    timeout: (args.timeout === undefined) ? TIMEOUT : 1000 * args.timeout,
    headers: { "User-Agent": USER_AGENT, "Accept-Encoding": "gzip, deflate" }
  }

  try {
    var response = await axios.get(args.url, config);
  } catch (error) {
    return processError(error);
  }

  return processResponse(response, args.url);
}

function processError(error) {
  if (error.response) {
    console.log("get status", error.response.status);
    return {
      error: {
        statusCode: StatusCodes.BAD_GATEWAY,
        body: { message: "could not get url content" }
      }
    }
  } else if (error.request) {
    console.log(error.request);
    return {
      error: {
        statusCode: StatusCodes.BAD_GATEWAY,
        body: { message: "could not get url content" }
      }
    }
  }

  console.error(error.message);
  return {
    error: {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: { message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) }
    }
  }
}

function processResponse(response, url) {
  console.log("response received");

  try {
    var doc = new JSDOM(response.data, {url: url});
    console.log('doc done');
    var reader = new Readability(doc.window.document);
    console.log('reader done');
    var article = reader.parse();
    console.log('parsed');
  } catch (error) {
    console.error(error);
    return {
      error: {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: { message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) }
      }
    }
  }

  return { body: article }
}

exports.main = main;