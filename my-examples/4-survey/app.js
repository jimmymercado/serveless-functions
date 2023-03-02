
const title = document.querySelector('.title h2')
const result = document.querySelector('.result')


const fetchData = async () => {
  try{
    const {data} = await axios.get('https://jm-serverless.netlify.app/api/survey')
    console.log(data)
    const response = data.map((item) => {
      const {framework, id, votes} = item
      return `
        <li>
          <div class='key'>${framework.toUpperCase().substring(0,2)}</div>
          <div>
            <h4>${framework}</h4>
            <p class='vote-${id}' data-votes='${votes}'>${votes} votes</p>
          </div>
          <button data-id='${id}'><i class='fas fa-vote-yea'></i></button>
        </li>
      `
    }).join('')
    result.innerHTML = response
  }catch(error){
    result.innerHTML =`<h4>Airtble API Error</h4>`
  }
}

window.addEventListener('load', () => {
  fetchData()
})

result.addEventListener('click', async function(e){
  if(e.target.classList.contains('fa-vote-yea')){
    const btn = e.target.parentElement
    const id = btn.dataset.id
   
    const voteNode = result.querySelector(`.vote-${id}`)
    console.log(voteNode.innerHTML)
    //voteNode.innerHTML = parseInt(voteNode.innerHTML) + 1
    

    const votes = voteNode.dataset.votes
    const newVotes = await modifyData(id, votes)
    if(newVotes){
      voteNode.textContent = `${newVotes} votes`
      voteNode.dataset.votes = newVotes
    }
  }  
})

async function modifyData(id, votes) {

  title.innerHTML = 'Submitting vote...'
  try{
    const data = await axios.put(`https://jm-serverless.netlify.app/api/survey`, {id, votes})
    return parseInt(votes) + 1

  }catch(error){
    console.log(error.response)
    return null
  }
  title.innerHTML = 'Survey'

  

}