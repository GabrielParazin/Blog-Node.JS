const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios")


module.exports = function(passport){
    //se o nome no form fosse password ia dar automatico
    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, function(email, senha, done){ 
        Usuario.findOne({email: email}).then(function(usuario){
            if(!usuario){
                return done(null, false, {message: "Essa conta não existe"})
            }
            //comparar valores encriptados
            bcrypt.compare(senha, usuario.senha, function(erro, batem){
                if(batem){
                    return done(null, usuario);
                } else {
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
    }).catch(function(err){
        
    });
    }))
    //salvar os dados do usuario em uma sessão
    passport.serializeUser(function(usuario, done){
        done(null, usuario.id)
    })

    passport.deserializeUser(function(id, done){
    Usuario.findById(id).lean().then(function(usuario){
        done(null, usuario)
    }).catch(function(erro){
        done(erro, null)
    })
});

}