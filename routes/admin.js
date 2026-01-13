const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria");
const Categoria = mongoose.model("categorias")
const {eAdmin}= require("../helpers/eAdmin"); //dentro do obj eadmin quero pegar so a funçao eadmin
//ASSIM QUE USA O MODEL DE FORMA EXTERNA DENTRO DO MOG, IMPORTA O MONG, CHAMA  O ARQUIVO DO MODEL, 
//DEPOIS CHAMA A FUNÇAO QUE PASSA UMA REF. DO SEU MODEL PARA UM VARIAVEL

//COLAR eAdmin nas rotas
router.get('/', function(req, res){
    res.render("admin/index"); //dentro do dir. views
})

router.get('/posts', function(req, res){
    res.render("Pagina de posts")
})
//eAdmin é so pra admin
router.get('/categorias',/* eAdmin, */function(req, res){
    Categoria.find().lean().sort({date: "desc"}).then(function(categorias){
        res.render("admin/categorias", {categorias: categorias})
    }).catch(function(erro){
        req.flash("error_msg", "Houve um erro!")
        res.redirect("/admin")})
})

router.get('/categorias/add', function(req, res){
    res.render("admin/addcategoria")
})

router.post('/categorias/nova', function(req, res){
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null ){
        erros.push({texto: "Slug inválido"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome pequeno"})
    }
    
    if(erros.length > 0){
        res.render("admin/addcategoria", {erros: erros}) //da pra passar dados pelo render
    }else{
        const novaCategoria = {
        nome: req.body.nome,
        slug: req. body.slug
    }

    new Categoria(novaCategoria).save().then(function(){
        //console.log("Cat. salva com sucesso");
        req.flash("success_msg", "Cat. salva com sucesso")
        res.redirect("/admin/categorias")
    }).catch(function(err){
        req.flash("success_msg", "Cat. salva com sucesso", "Erro ao salvar Cat.")
        //console.log("Erro ao salvar Cat." + err);
        res.redirect("/admin")
    });
    }
})

router.get("/categorias/edit/:id", function(req, res){
    //params ta trablahando com paramteros, body é formulario
    Categoria.findOne({_id: req.params.id}).lean().then(function(categoria){
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch(function(erro){
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", function(req, res){

    Categoria.findOne({_id: req.body.id}).then(function(categoria){

        //sem sistema de validação
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;  

        categoria.save().then(function(){
            req.flash("success_msg", "Editou com sucesso");
            res.redirect("/admin/categorias")
        }).catch(function(erro){
            req.flash("error_msg", "Erro ao salvar a edição");
            res.redirect("/admin/categorias")
        })

    }).catch(function(){
        req.flash("error_msg", "Erro ao editar");
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", function(req, res){
    Categoria.deleteOne({_id: req.body.id}).then(function(){
            req.flash("success_msg", "Deletou com sucesso");
            res.redirect("/admin/categorias")
        }).catch(function(erro){
            req.flash("error_msg", "Erro ao deletar a edição");
            res.redirect("/admin/categorias")
        })
})

//ULTIMO?
module.exports = router