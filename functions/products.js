const Airtable = require(('airtable-node'))

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API })
  .base(process.env.AIRTABLE_BASE)
  .table('shoes')

exports.handler = async (event, context, callback) => {
  // console.log(event)
  // console.log('event.queryStringParameters')
  // console.log(event.queryStringParameters)
  const {id} = event.queryStringParameters
  
  
  if(id){
    try{
      const product = await airtable.retrieve(id)
      console.log(product)
      if(product.error){
        return{
          headers:{'Access-Control-Allow-Origin': '*'},
          statusCode:404,
          body: `No product with id: ${id}`
        }
      }

      const {name, image, price, description} = product.fields
      const url = image[0].url

      return{
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode:200,
        body: JSON.stringify({id, name, url, price, description})
      }

    }catch(error){
      return{
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode:500,
        body: 'API Error'
      }
    }
  }
  
  

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