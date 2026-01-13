const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Usuario");
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require('passport');

router.get("/registro", function(req, res){
    res.render("usuarios/registro")
})

router.post("/registro", function(req, res){
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null ){
        erros.push({texto: "Email inválido"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null ){
        erros.push({texto: "Senha inválido"})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome pequeno"})
    }
    //tamanho da senha error fazer
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes"})
    }
    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros}) //da pra passar dados pelo render
    } else{
        Usuario.findOne({email: req.body.email}).then(function(usuario){
            if(usuario){
                req.flash("error_msg", "E-mail já existe");
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha

                })

                bcrypt.genSalt(10, function(erro, salt){
                     //3 parametro, 1 valor, 2 o salt,3 fnçao de callback
                    bcrypt.hash(novoUsuario.senha, salt, function(erro, hash){
                        if(erro){
                            req.flash("error_msg", "Erro durante o salvamento do usuário");
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(function(){
                            req.flash("success_msg", "Registrado com sucesso");
                            res.redirect("/")
                        }).catch(function(erro){
                            req.flash("error_msg", "Houve um erro ao criar um usuario");
                            res.redirect("/usuarios/registro")
                        })

                    })
                })
            }
        }).catch(function(erro){
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/")
        })
    }
})

router.get("/login", function(req, res){
    res.render("usuarios/login")
})
//rota de autenticaçao precisa do next ??????
router.post("/login", function(req, res, next){
    //sempre usar isso para autenticar
    passport.authenticate("local", {
       //caminho para redirecionar caso a autenticaçao tenha sucesso
        successRedirect: "/",
        //caso tenha ocrrido falah
        failureRedirect: "/usuarios/login",
        //habilitar as mensagens flash
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", function(req, res){
    
    req.logout(function(err) {
    if (err) {
        return next(err);
    }
    });
    req.flash("success_msg", "Você fez logout");
    res.redirect("/")
})

module.exports = router