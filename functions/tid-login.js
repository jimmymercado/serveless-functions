
exports.handler = async (event, context, callback) => {

  const {code} = event.queryStringParameters
  const host = 'preview'
	const api_host = host==='geospatial.trimble.com' ? 'https://id.trimblecloud.com' : 'https://stage.id.trimblecloud.com';
	const api_auth = '/oauth/authorize';
	const api_token = '/oauth/token';
	const api_info = '/oauth/userinfo';
	const client_id = '48143bb4-2d81-4d09-899c-0992f82e9565';
	const client_secret = 'ebe16f58573f4342b7e218acdbb0d5b3';
	//const redirect_uri = 'https://forms.trimble.com/geospatial/tbc-trial/tid.html';
	//const redirect_uri = 'https://preview-geospatialtrimbleproduction.gatsbyjs.io/en/products/software/trimble-business-center/trial-download';
	//const redirect_uri = 'http://localhost:8001/en/products/software/trimble-business-center/trial-download';
  const redirect_uri = 'http://localhost:8888/api/tid-login'
	const salt = getRandomString(64);
	let tid_loaded = false;
  let access_token = null;
	let user_info = null;

  async function getToken(code){		
		//POST: /oauth/token
		//Host: stage.id.trimblecloud.com
		//Accept: application/json
		//Authorization: Basic VmNqWUx0VWs4R3dCRHhpakNVbjNfTks1TDNvYTpoVkdERjNFdnp1VU9kaU1ra1ozaVU5d2ZZc0lh
		//Content-Type: application/x-www-form-urlencoded
		//Cache-Control: no-cache

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
		return response.json();
		
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


  const res = await getToken(code).then((data) => {
    console.log('data')
    console.log(JSON.stringify(data))
    return JSON.stringify(data)
  })

  return {
    headers:{'Access-Control-Allow-Origin': '*'},    
    statusCode:200,
    body: res
  }
}