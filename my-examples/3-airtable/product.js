
const result = document.querySelector('.result')

const fetchData = async () => {
  //console.log(window.location.href)
  
  try{
    const location = new URL(window.location.href)    
    const searchParams = location.searchParams
    // console.log("searchParams")
    // console.log(searchParams.get('id'))
    const pid = searchParams.get('id')
    const {data} = await axios.get(`https://jm-serverless.netlify.app/api/products?id=${pid}`)
    console.log(data)
    const {id, name, url, price, description} = data
    
    const item = `
      <article class="product">
        <img class="product-img" src="${url}" alt="${name}"/>
        <div class="product-info">
          <h5>${name}</h5>
          <h5 class="price">$${price}</h5>
          <p class="desc">${description}</p>
        </div>
      </article>
      `
       result.innerHTML = item
  }catch(error){

  }
}

fetchData()