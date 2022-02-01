/* Class standard from user */
class User{

    constructor(name, gender, birth, country, email, pass, photo, admin){
        this._id;
        this._name = name;
        this._gender = gender; 
        this._birth = birth;
        this._country = country;
        this._email = email; 
        this._pass = pass;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    get name(){
        return this._name;
    }

    get id(){
        return this._id;
    }

    get gender(){
        return this._gender;
    }
    get birth(){
        return this._birth;
    }
    get country(){
        return this._country;
    }
    get email(){
        return this._email;
    }
    get pass(){
        return this._pass;
    }
    get photo(){
        return this._photo;
    }
    set photo(image){
        this._photo = image;
    }
    get admin(){
        return this._admin;
    }

    get register(){
        return this._register;
    }



    loadFromJSON(json){

        for(let name in json){
            switch (name) {
                case '_register':
                        this[name] = new Date(json[name]);
                    break;
            
                default:
                    this[name] = json[name];
                  
            }

           
        }
       
    }

    
    static getUsersStorage(){

        let users = [];
      /*  
        if(sessionStorage.getItem("users")){
            users = JSON.parse(sessionStorage.getItem("users"));
        }*/

        if(localStorage.getItem("users")){
            users = JSON.parse(localStorage.getItem("users"));
        }

        return users;
    }

    getNewId(){
        // Variable to be available in all applications 
        if(!window.id) window.id = 0;
        
        return id++;
        

    }


    save(){

        // parse - convert json in array or obj | stringfy - convert array or object in obj json 
        
        let users = User.getUsersStorage();
        
        if(this.id > 0){

            let user = users.filter(u=>{return u._id == this.id})
        }else{
            this._id = this.getNewId();

            users.push(this);

            /* sessionStorage.setItem("users", JSON.stringify(users));*/
    
            localStorage.setItem("users", JSON.stringify(users));
    
        }

       
    }

}