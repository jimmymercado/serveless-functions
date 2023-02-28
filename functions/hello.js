
//domain/.netlify/functions/hello
exports.handler = async (event, context, callback) => {
  return {
    headers:{'Access-Control-Allow-Origin': '*'},    
    statusCode:200,
    body:'Our first Netlify Function'
  }
}