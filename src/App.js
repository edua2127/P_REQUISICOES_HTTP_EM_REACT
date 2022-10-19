import './App.css';
import {useState, useEffect } from 'react'
import { useFetch } from './hooks/useFetch';
const url = 'http://localhost:3000/products';
function App() {
  const [produtoList, setProdutosList] = useState([])
  const [name, setNome] = useState("")
  const [price, setPrice] = useState("")

  const {data, httpConfig, loading, error} = useFetch(url)

useEffect(()=> {
  setProdutosList(data)
}, [data])


 /*
    Como fazer um post usando o fetch: 
    const res = await fetch(url, {
      method: 'POST',
       headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(produto)
      });
  */
const adicionarProduto = async (event) => {
  event.preventDefault();

  const produto = {
    name,
    price
  }
  httpConfig(produto, 'POST')
  setNome("")
  setPrice("")
}
const removerProduto = (event) => {
  const data = {
    id: event.target.id
  }
  httpConfig(data, 'DELETE')
}

return (
    <div className="App">
      <h1>Lista de Produtos</h1>
      {/* tela de loading - até o termino da requisição */}
      {loading && <p>Carregando dados</p>}
      {error && <p>{error}</p>}
      {!error && 
      <ul>
        { produtoList.map((produto)=> (
          <li key={produto.id}>Id: {produto.id} nome: {produto.name} - R$ {produto.price}
            <button onClick={removerProduto} id={produto.id}>Excluir Produto</button>
          </li>
        ))}
      </ul>}
      
      <div className='add_produto'>
        <form onSubmit={adicionarProduto}>
          <label>
            <span>Nome: </span>
            <input type="text" name='nome' value={name} onChange={(event)=> setNome(event.target.value)}/>
          </label>
          <label>
            <span>Preço: </span>
            <input type="number"  name='price' value={price} onChange={(event)=> setPrice(event.target.value)}/>
          </label>
          {loading && <input type="submit" value="Aguarde" disabled />}
          {!loading && <input type="submit" value="Cadastrar Produto" />}
          
        </form>
      </div>
    </div>
  );
}

export default App;
