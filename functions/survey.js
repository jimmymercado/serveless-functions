
const Airtable = require(('airtable-node'))
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API })
  .base('appOUbgooxTuUTz8r')
  .table('survey')

exports.handler = async (event, context, callback) => {
  console.log(event)
  const method = event.httpMethod

  if(method==='GET'){
    try{
      const {records} = await airtable.list()
      const survey = records.map((item) => {
        const {id} = item;
        const {framework, votes} = item.fields
        return {id, framework, votes}
      })
      return{
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode:200,
        body: JSON.stringify(survey)
      }
    }catch(error){
      return{
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode:404,
        body: 'Airtable Error'
      }
    }  
  }
  if(method==='PUT'){
    const {id, votes} = JSON.parse(event.body)
    if (!id || !votes){
      return{
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode:400,
        body: 'Airtable Error - missing data'
      }
    }

    const fields = {votes:Number(votes) + 1}
  
    const item = await airtable.update(id, { fields })
    console.log(item)
    if(item.error){
      return{
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode:400,
        body: JSON.stringify(item)
      }
    }

    return{
      headers:{'Access-Control-Allow-Origin': '*'},
      statusCode:200,
      body: JSON.stringify(item)
    }

  }
  
  //fallback 
  return{
    headers:{'Access-Control-Allow-Origin': '*'},
    statusCode:405,
    body: 'API Error - http GET or PUT only'
  }

  
}