//como se fossem midlewares
//para proibir que um usuario entre em uma rota especifica
//verificar se sta autenticado e é admin
module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){ //isAuthenticated() verificar se esta autenticado
            return next();
        }
        req.flash("error_msg", "Você precisa ser um Admin!")
        res.redirect("/")
    }
}


/*module.exports = { assim é pra usar se esta logado
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){ //isAuthenticated() verificar se esta autenticado
            return next();
        }
        req.flash("error_msg", "Você precisa estar logado!")
        res.redirect("/")
    }
}*/

