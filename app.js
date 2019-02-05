const app = require("express")();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// body-parser config
app.use(bodyParser.json());

// mongo connect config
mongoose.connect("mongodb://api_node_mongo:abc123@ds219055.mlab.com:19055/produtos", { useNewUrlParser: true } ,() => {
    console.log("Banco de Dados Conectado");    
});

require("./models/Produto");
const Produto = mongoose.model("Produto");

// Cadastro
app.post("/produto", (request, response) => {
    
if(request.body.nome != undefined && request.body.fabricante != undefined && request.body.preco != undefined){
    
        var produto = new Produto({
                nome: request.body.nome,
                fabricante: request.body.fabricante,
                preco: request.body.preco
            });

            produto.save().then(() => {

                //dado salvo com sucesso
                response.statusCode = 201;
                response.send();

            }).catch((erro) => {

                if(erro){
                   throw erro; 
                }

                response.statusCode = 417;
                response.send();
                // Aconteceu alguma falha   
            });
    
    } else {
        response.statusCode = 406;
        response.send();
    }
        
});


app.listen(8888, ()=> {
    console.log("API rodando");
});
