/* Class standard from user */
class User{

    constructor(name, gender, birth, country, email, pass, photo, admin){
        
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

    set name(name){
        this.name = name;
    }

}