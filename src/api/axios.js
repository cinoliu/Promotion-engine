import axios from "axios";
let AUTH_TOKEN=(function(){
    return sessionStorage.getItem("Authorization");
})();

var instance = axios.create({
});
instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;
instance.interceptors.request.use(function(config){

    let url = config.url;
    if(url.indexOf("login")>-1){
        sessionStorage.setItem('Authorization',"");
        config.headers.Authorization = "";
    }
    if(url.indexOf("user")>-1 && url.indexOf("login")<0){
        config.headers.Authorization =sessionStorage.getItem("Authorization");
    }
    return config;
},function(err){
    return Promise.reject(err);
});
instance.interceptors.response.use(function(res){
    if(res.headers.Authorization){
        sessionStorage.setItem('Authorization',res.headers.Authorization);
    }
    return res;
},function(err){
    return err;
});
export default instance;


module.exports = {
   baseUrl :'http://192.168.2.130:8080/tms',

};


