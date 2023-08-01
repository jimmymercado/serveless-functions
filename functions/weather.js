

exports.handler = async (event, context, callback) => {
  const method = event.httpMethod
  console.log(method)
  return {
    headers:{'Access-Control-Allow-Origin': '*'},    
    statusCode:200,
    body:'Our Weather Function'
  }
}