
// const items = [
//   {name:'Jim'},
//   {name:'Zel'}
// ]

const items = require("../assets/data")

exports.handler = async (event, context, callback) => {
  return{
    statusCode: 200,
    body: JSON.stringify(items)
  }

}