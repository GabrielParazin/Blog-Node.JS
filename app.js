//CAARREGANDO MODULOS
const express = require('express');
//const handlebars = require('express-handlebars');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); //serve para manipular pastas e diretorios
const admin = require('./routes/admin.js');
const session = require('express-session');
const flash = require('connect-flash'); //essa msg so duram por tempo curto, flash é um tipo de sessao que so aparece uma vezx
const usuarios = require("./routes/usuario.js");
const passport = require('passport');
require("./models/Categoria");
const Categoria = mongoose.model("categorias")
require("./config/auth")(passport)
/*const { execPath } = require('process');
const { default: mongoose } = require('mongoose');*/

const app = express();

//CONFIGURAÇOES
    //SESSÃO
    //nessa ordem 1
    app.use(session({
        secret: "cursodenode", //chave para gerar um sessao
        resave: true,
        saveUninitialized: true
    }))

    //tem que estar aqui 2
    app.use(passport.initialize());
    app.use(passport.session());

    //3
    app.use(flash())
    //MIDDLEWARE
    app.use(function(req, res, next){
        //variaveis globais
        res.locals.success_msg = req.flash("success_msg") //objeto locals para criar variaveis globais
        res.locals.error_msg = req.flash("error_msg")  
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null //vai armazenar os dados do usuario
        next();
        
    })
    //BODY PARSER
    app.use(bodyParser.urlencoded({extend: true}));
    app.use(bodyParser.json());
    //HANDLEBARS
    /*app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');*/

    app.engine('handlebars', engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');
    //MONGOOSE
        //
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogappbd').then(function(){
        console.log("Conectou o BD");
    }).catch(function(err){
        console.log("Não conectou o BD" + err);
    });
    //PUBLIC
    //para falar que nossa psat é a public
    app.use(express.static(path.join(__dirname, 'public'))) //pegar o caminho absoluto para a pasta public
    app.use(function(req, res, next){
        console.log("OI EU SOU UM MIDDLEWARE")
        next(); //senão, não carrega, manda passar
    });
//ROTAS
    //pra funcionar precisar consigurar isso
    //sempre por frotas embaixo das config.
    //quando cria um grupo de rotas, voce paassa um preifox para essas rotas
    app.get("/", function(req, res){
        Categoria.find().lean().sort({data: "desc"}).then(function(categorias){
        res.render("index");
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro interno");
        res.redirect("/404")
    });
    })

app.get("/404", function(req, res){
    res.send("ERROR 404")
})

    app.use('/admin', admin)
    app.use('/usuarios', usuarios)
    //para criar rota principal tem que ser aqui nesse arquivo / aula 32

//OUTROS
const PORT = 8081
app.listen(PORT, function(){
    console.log("Servidor subiu");    
})