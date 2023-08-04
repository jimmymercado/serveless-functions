const dotenv = require("dotenv")
dotenv.config()

  
exports.handler = async (event, context, callback) => {

  const {code} = event.queryStringParameters
  const host = process.env.APP_ENV
	//const api_host = host==='geospatial.trimble.com' ? 'https://id.trimblecloud.com' : 'https://stage.id.trimblecloud.com';
	const api_host = 'https://stage.id.trimblecloud.com';
	const api_token = '/oauth/token';
	const api_info = '/oauth/userinfo';
	const client_id = process.env["TID_" + process.env.APP_ENV.toUpperCase() + "_CLIENT_ID"] //'48143bb4-2d81-4d09-899c-0992f82e9565';
	const client_secret = process.env["TID_" + process.env.APP_ENV.toUpperCase() + "_CLIENT_SECRET"] //'ebe16f58573f4342b7e218acdbb0d5b3';
	//const redirect_uri = 'https://forms.trimble.com/geospatial/tbc-trial/tid.html';
	// const redirect_uri = 'https://preview-geospatialtrimbleproduction.gatsbyjs.io/en/products/software/trimble-business-center/trial-download-jm';
	const redirect_uri = 'https://jm-serverless.netlify.app/api/tid-userinfo'
  //const redirect_uri = 'http://localhost:8888/api/tid-userinfo'
	const salt = getRandomString(64);
	let tid_loaded = false;
  let access_token = null;
	let user_info = null;


  async function getToken(code){		
		// API CALL:
    // POST https://{stage.id.trimble.com || id.trimble.com}/oauth/token
		// HEADER:
    // Authorization: Basic <Base64 encoded “ClientID:ClientSecret”>
    // Accept: application/json
    // REQUEST BODY:
    // grant_type= authorization_code
    // code= {given authorization_code}
    // client_id= {Application ID registered for the application}
    // redirect_uri= {Redirect URL registerd with Identity}

		const authBase64 = btoa(client_id + ':' + client_secret);
		
		const requestHead = new Headers()
		requestHead.append('Content-Type', 'application/x-www-form-urlencoded');
		requestHead.append('Authorization', 'Basic ' + authBase64);
		requestHead.append('Accept', 'application/json');
		
		const requestBody = new URLSearchParams()
		requestBody.append('grant_type', 'authorization_code');
		requestBody.append('redirect_uri', redirect_uri);
		requestBody.append('code_verifier', salt);
		requestBody.append('client_id', client_id);
		requestBody.append('code', code);
		requestBody.append('state', 'en');
		
		let requestOptions = {
			method: 'POST',
			headers: requestHead,
			body: requestBody,
			redirect: 'follow',
		};
		
		const response = await fetch(api_host + api_token, requestOptions);		
		return await response.json();
		
	}

  async function getUserInfo(token) {
		// API Call:
    // GET {baseURL}/oauth/userinfo
    // POST {baseURL}/oauth/userinfo
    // HEADER
    // Authorization: Bearer <access_token>
    // Accept: application/json
		
		const requestHead = new Headers()
		requestHead.append('Authorization', 'Bearer ' + token);
		requestHead.append('Accept', 'application/json');
		
		let requestOptions = {
			method: 'GET',
			headers: requestHead,
			redirect: 'follow',
		};
		
		const response = await fetch(api_host + api_info, requestOptions);
		return response.json()
	}

  
  function getRandomString(length) {
		 var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		 var charLength = chars.length;
		 var result = '';
		 for ( var i = 0; i < length; i++ ) {
				result += chars.charAt(Math.floor(Math.random() * charLength));
		 }
		 return result;
	}


  if(code){
    try {
      const tid_token = await getToken(code)
      console.log('tid_token', tid_token)
      
      if(tid_token?.error){
        return{
          headers:{'Access-Control-Allow-Origin': '*'},
          statusCode: 500,
          body: `getToken Error: ${JSON.stringify(tid_token)}`
        }
      }      

      const tid_user_info = await getUserInfo(tid_token.access_token)
      console.log('tid_user_info', tid_user_info)

      // .then((data) => {
      //   console.log('getToken data', data)
      //   if(data?.error){
      //     return{
      //       headers:{'Access-Control-Allow-Origin': '*'},
      //       statusCode: 500,
      //       body: `getToken Error: ${data?.error}`
      //     }

      //   }
      //   return {
      //     headers:{'Access-Control-Allow-Origin': '*'},
      //     statusCode: 200,
      //     body: JSON.stringify(data)
      //   }
      // })
      return {
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode: 200,
        body: JSON.stringify(tid_user_info)
      }
    } catch (err){
      return{
        headers:{'Access-Control-Allow-Origin': '*'},
        statusCode: 500,
        body: `{"error: "TID API Error", "errorMessage" : ${err}}`
      }
    }
      //console.log('tid_user_info', tid_user_info)

      // .then(token => {
      //   console.log('token', token)
      //   return getUserInfo(token).then((data) => {
      //     console.log('getUserInfo - data', data)
      //     if(data?.error){
      //       console.log('getUserInfo - data - error', data)
      //       return{
      //         headers:{'Access-Control-Allow-Origin': '*'},
      //         statusCode: 500,
      //         body: `getUserInfo Error: ${JSON.stringify(data)}`
      //       }
      //     } else {
      //       return data
      //     }
          
      //   })
        
      // })      

      
      
      
   
  }
  return {
    headers:{'Access-Control-Allow-Origin': '*'},
    statusCode: 500,
    body: '{"error: "TID Unauthorized Access"}'
  }










  
}