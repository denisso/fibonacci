window.onload = function() {
    try{
        const fetchResposponse = (request) => new Promise((resolve, reject) =>{
            const fetch_options = {
                method: 'GET'
            };
            fetch(`/api?${request}`, fetch_options)
                .then(response => response.json())
                .then(json => resolve(json.fibonacci) )
                .catch(err => reject("Во время запроса произошла ошибка"))
        })
        const $output = document.querySelector("#output")
        document.querySelector("button#get-next").onclick = function(){
            fetchResposponse("get-next")
                .then(response => $output.innerHTML = response)
                .catch(err => $output.innerHTML = err)
        }
        document.querySelector("button#reset").onclick = function(){
            fetchResposponse("reset")
                .then(response => $output.innerHTML = response)
                .catch(err => $output.innerHTML = err)
        }
    }
    catch(e){
        console.log(e.message)
    }    
};