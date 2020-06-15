module.exports = {
    ifeqs(a,b, options){

        if(!a && !b){
            return options.fn(this);
        }
        else{
            options.inverse(this);
        }
    }
}