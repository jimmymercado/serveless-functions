// it takes few minutes

const form = document.querySelector('.form')
const input = document.querySelector('.form-input')
const alert = document.querySelector('.alert')
const result = document.querySelector('.result')
alert.style.display = 'none'


form.addEventListener('submit', (event) => {
  event.preventDefault()
  const city = input.value
  console.log(city)
  if(city){
    getWeatherData(city)
  }
})


async function getWeatherData(city){
  alert.style.display = 'none'
  try{
    const {data} = await axios.post('/api/weather', {city})
    console.log(data)
  }catch(error){
    console.log(error.response)
  }
}