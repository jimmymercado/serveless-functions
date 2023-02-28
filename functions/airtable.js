

const Airtable = require('airtable-node');

//console.log(process.env.AIRTABLE_API)
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API })
  .base(process.env.AIRTABLE_BASE)
  .table('shoes')
 

exports.handler = async (event, context, callback) => {

  try{
    const {records} = await airtable.list()
    const products = records.map((product)=>{
      const {id} = product
      const {name, image, price, description} = product.fields
      const url = image[0].url
      return {id, name, url, price, description}
    })

    console.log(records)

    return{
      headers:{'Access-Control-Allow-Origin': '*'},
      statusCode: 200,
      body: JSON.stringify(products)
    }
    
  }catch(error){
    return{
      headers:{'Access-Control-Allow-Origin': '*'},
      statusCode: 500,
      body: 'Airtable API Error'
    }
  }



}