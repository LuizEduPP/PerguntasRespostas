const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./model/Pergunta")
const Resposta = require("./model/Resposta")


connection
    .authenticate()
    .then(() => {
        console.log("Conexão efetuada com o banco!")
    })
    .catch((erro)=> {
        console.log(erro)
    })

//Dizendo o express usar o ejs como view engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id', 'desc']
    ] }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvar-pergunta", (req, res) => {
    var titulo = req.body.titulo
    var descricao = req.body.descricao
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })    
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id

    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[['id', 'desc']]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })   
        } else 
            res.redirect("/")  
    })   
})

app.post("/salvar-resposta", (req, res) => {
    var perguntaId = req.body.perguntaId
    var corpo = req.body.corpo
    
    Resposta.create({
        perguntaId: perguntaId,
        corpo: corpo
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId)
    })    
})

app.listen(8080, ()=>{
    console.log("App executando!")
})