class UserController{
    
    /* Constructor to initialize the form variables and call onSubmit() */ 
    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    /* Function for wait for the click on the submit button */
    onSubmit(){

        this.formEl.addEventListener("submit", e => {
            e.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type='submit']"); 
            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl);
            if(!values) return false;
            
                // the Then method accepts two functions like arguments for to callback from resolve and reject  
                this.getPhoto(this.formEl).then(
                        (content) => { // Resolve
                        
                            // Change value photo
                            values.photo = content;
                        
                            values.save();
                            
                            // Add Line on table for each user
                            this.AddLine(values);  


                            // Restart fields form
                            this.formEl.reset();

                            // after add the line, activate submit button
                            btnSubmit.disabled = false;   
                    }, // Reject
                        e => {
                            // Show error
                            console.error(e);
                    }
                );
                
         
            
        });

    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{   
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", e=>{
            e.preventDefault();

            let btnSubmit = this.formUpdateEl.querySelector("[type='submit']"); 
            btnSubmit.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];

            // Convert json in obj
            let userOld = JSON.parse(tr.dataset.user);

            // Copy old obj to new with data
            let resultCombinationObjs = Object.assign({}, userOld, values); // return one object  {} , left object subscribe of right  
            
              
               // the Then method accepts two functions like arguments for to callback from resolve and reject  
               this.getPhoto(this.formUpdateEl).then(
                    (content) => { // Resolve
                            
                        if(!values.photo){
                            resultCombinationObjs._photo = userOld._photo;
                        }else{
                            resultCombinationObjs._photo = content;
                        }

                        let user = new User();

                        user.loadFromJSON(resultCombinationObjs);
                        
                        user.save();

                        this.getTR(user, tr);

                        this.updateCount();

                        // Restart fields form
                        this.formUpdateEl.reset();
                        
                        // after add the line, activate submit button
                        btnSubmit.disabled = false;   

                        this.showPanelCreate();
                    }, // Reject
                        e => {
                            // Show error
                            console.error(e);
                        }
                );
        });
    }

    onDelete(){

    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    }

    getPhoto(formEl){
        
        // Promise because the filereader to use methods asynchronous, and promise return two states for result ok or reject
        return new Promise((resolve, reject) => { 
            
            // instance object FileReader 
            let fileReader = new FileReader();

            // Return found item in new array 
            let element = [...formEl.elements].filter(item=>{
                if(item.name == 'photo'){
                    return item;
                }
            });

            // Get file uploaded
            let file = element[0].files[0];

            // When loading is finished 
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) => {
                reject(e);
            }

            if(file){ // if exists file, reads the url else return photo no-image 
                fileReader.readAsDataURL(file);
            }else{
                resolve('dist/img/boxed-bg.jpg');
            }

        });
    }

    getValues(formEl){

        let user = {};
        let isValid = true;
        //Iterator of form elements
        [...formEl.elements].forEach(function (field, idx) {
            
            // Check required fields is empty 
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add("has-error");
                isValid = false;
                return false;
            }

            if(field.name == 'gender'){
                if(field.checked){
                    user[field.name] = field.value;
                }
            }else if(field.name == 'admin'){
                user[field.name] = field.checked;
            }
            else{
                user[field.name] = field.value;
            }
            
        });
        if(!isValid){
            
            return false;
        }  
        
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.pass,
            user.photo,
            user.admin
        );
 }

    getUsersStorage(){

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

    selectAll(){
        
        
        let users = this.getUsersStorage();
        
        users.forEach( userData => {
            let user = new User();
           
            user.loadFromJSON(userData);

            this.AddLine(user);
        });
    }


    getTR(dataUser, tr = null){
      
        if(tr == null) tr = document.createElement("tr");

        // Save data in html [data-user] of user for to use in another method
        tr.dataset.user = JSON.stringify(dataUser);
        

        //    this.tableEl.innerHTML += `
        tr.innerHTML = 
        `
            <td>
                <img src="${dataUser.photo}" class="img-circle img-sm">
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        return tr;


    }

    // HTML formater - Add Line on screen 
    AddLine(dataUser){
       
        this.tableEl.appendChild(this.getTR(dataUser));
        
        this.updateCount();
    };

    addEventsTr(tr){
        
        tr.querySelector(".btn-delete").addEventListener('click', (e) => {
            console.log(this, tr, e);
            if(confirm('Are you sure?')){
               tr.remove(); // Delete a row [tr]
               this.updateCount();
            }

            e.preventDefault();
        });

        // Add event click at each button  
        tr.querySelector(".btn-edit").addEventListener('click', e=> {

            // Recover data-user from tr 
            let userData = JSON.parse(tr.dataset.user);
            
            
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            // Search and fill fields
            for(let data in userData){
                let field = this.formUpdateEl.querySelector("[name=" + data.replace('_', '') + "]");
                
                
                if(field){
                    
                    switch (field.type) {
                        case 'file':
                                continue;
                            break;
                    
                        case 'radio':
                                field = this.formUpdateEl.querySelector("[name=" + data.replace('_', '') + "][value="+userData[data]+"]");
                                field.checked = true;
                            break;
                    
                        case 'checkbox':
                                field.checked = userData[data];
                            break;
                    
                        default:
                            field.value = userData[data];
                          
                    }

                    
                }

            }

            this.formUpdateEl.querySelector(".image").src = userData._photo;

            this.showPanelUpdate();
        });

    }

    updateCount(){

        var numberUsers = 0;
        var numberUsersAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            let user = JSON.parse(tr.dataset.user);
            numberUsers++;
        
            if(user._admin) numberUsersAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;  
        document.querySelector("#number-users-admin").innerHTML = numberUsersAdmin;  

    }


}
