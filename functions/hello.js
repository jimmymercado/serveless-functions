
//domain/.netlify/functions/hello
exports.handler = async (event, context, callback) => {
  return {
    statusCode:200,
    body:'Our first Netlify Function'
  }
}