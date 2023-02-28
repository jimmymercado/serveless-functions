const result = document.querySelector('.result')

const fetchData = async () => {
  try{
    const {data} = await axios.get('https://jm-serverless.netlify.app/api/products')
    const products = data.map((product) => {
      const {id, name, url, price, description} = product
      return `
      <article class="product">
        <a href="product.html?id=${id}"><img src="${url}" alt="${name}"/></a>
        <div class="info">
          <h5>${name}</h5>
          <h5 class="price">$${price}</h5>
        </div>
      </article>
      `
    }).join('')

    result.innerHTML = products

  }catch(error){

  }
}

fetchData()