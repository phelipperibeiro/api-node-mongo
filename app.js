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
    
if(request.body.nome != undefined && request.body.fabricante != undefined && request.body.preco !=   undefined){
    
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

            response.statusCode = 417;
            response.send();

            if(erro){
               throw erro; 
            }
            // Aconteceu alguma falha   
        });
    
} else {
    response.statusCode = 406;
    response.send();
}
        
});

app.get('/produtos', (request, response) => {
    
    Produto.find({}).lean().exec(function(erro,docs) {
        
       response.json(docs);
       response.end();
       
    });
    
});


app.get('/produto/:id', function (request, response) {
        
    Produto.findById(request.params.id).then((produto) => {
        
        response.statusCode = 200;
        response.json(produto);  
        
    }).catch((erro) => {
        
        response.statusCode = 417;
        response.send();
            
        if(erro){
            throw erro; 
        }

    });   
        
        
//    Produto.find({ _id: request.params.id }).lean().exec(function (erro, docs) {
//        
//        if(erro){
//            response.statusCode = 417;
//            response.send();
//        }
//        
//        response.json(docs);
//        response.end();
//        
//    });
    
});


app.put('/produto/:id', function (request, response) {

    Produto.findOneAndUpdate({ _id: request.params.id }, request.body, { upsert: true }, function (erro, doc) {
        
        if (erro) {
            response.status(500).json({ error: erro.message });
            response.end();
            return;
        }
        
        response.json(request.body);
        response.end();
    });
});

app.delete('/produto/:id', function (request, response, next) {

    Produto.find({ _id: request.params.id }).remove(function (err) {
        if (err) {
            response.status(500).json({ error: err.message });
            response.end();
            return;
        }
        response.json({success: true});
        response.end();
    });
});

app.listen(8888, ()=> {
    console.log("API rodando");
});
