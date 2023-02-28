const items = require("../assets/data")

exports.handler = async (event, context, callback) => {
  return{
    headers:{'Access-Control-Allow-Origin': '*'},
    statusCode: 200,
    body: JSON.stringify(items)
  }

}