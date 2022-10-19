import {useState, useEffect} from 'react'

export const useFetch = (url) => {

    const [data, setData] = useState([])
    const [config, setConfig] = useState(null)
    const [method, setMethod] = useState(null)
    const [callFetch, setCallFetch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [itemId, setItemId] = useState(null)

    /*
        callFetch => usado para verificar se um POST foi realizado, se sim é executado
        um get dos items, para que a lista fique atualizada

        error => guarda a mensagem de erro

        loading => usada para sinalizar quando começa e termina uma requisição, o loading é true quando a requisição
        começa e fica false quando está termina, isto é indicado com os setLoading no inicio e no fim de cada requisição
        
        useEffect => usado para monitar as variaveis utilizadas dentro, caso alguma delas
        seja modificada o codigo dentro do useEffect tambem será
    */

    useEffect(() => {
        const fetchData = async() => {
            /*
                Começo da requisição => loading = true
                Termino da requisição => loading = false

                try catch => usado para pegar a mensagem de erro do backend
                e guarda-la no state error, para essa poder ser exibida no frontend
            */
            setLoading(true)
            try {
                const res = await fetch(url)
                const json = await res.json()
                setData(json);
                setError(null)
            } catch (error) {
                console.log(error.message)
                setError("algum erro ocorreu no carregamento dos dados")
            }
            setLoading(false)
        }

        fetchData()
    }, [url, callFetch])


   /*
    httpConfig => usado para fazer as configurações de cada metodo utilizado na aplicação,
    possibilitando que um unica metodo http execute varios outros metodos
   */
    
    const httpConfig = (data, methodPassado) => {
        if (methodPassado === 'POST') {
            setConfig({
                method: methodPassado,
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(data)
            }) 
            setMethod(methodPassado)
        }
        if (methodPassado === 'DELETE') {
            setConfig({
                method: methodPassado,
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            setItemId(data.id)
            setMethod(methodPassado) 
        }
    }

    useEffect(()=> {
        if(method === 'POST') {
            const httpRequest = async() => {
                let fetchOptions = [url, config]

                const res = await fetch(...fetchOptions);

                const json = await res.json();

                setCallFetch(json)
            }
            httpRequest()
        }
        if(method === 'DELETE') {
            const httpRequest = async() => {
                let fetchOptions = [url + "/" + itemId, config]
                console.log(...fetchOptions)
                const res = await fetch(...fetchOptions);

                const json =  res.status;
                setCallFetch(json)
            }
            httpRequest()
        }
    }, [config, url, method, itemId])

    return {data, httpConfig, loading, error};
}