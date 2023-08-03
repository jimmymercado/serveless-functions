
const result = document.querySelector('.result')
const fetchData = async () => {
  try{
    const data = await axios.get('/api/hello')
    //document.querySelector('.result').innerHTML = data.data
    result.textContent = data.data
  }catch(error){
    console.log(error.response)
  }
}

fetchData()