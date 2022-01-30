class UserController{
    
    /* Constructor to initialize the form variables and call onSubmit() */ 
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }

    /* Function for wait for the click on the submit button */
    onSubmit(){

        this.formEl.addEventListener("submit", e => {
            e.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type='submit']"); 
            btnSubmit.disabled = true;

            let values = this.getValues();
            
            // the Then method accepts two functions like arguments for to callback from resolve and reject  
            this.getPhoto().then(
                    (content) => { // Resolve

                        // Change value photo
                        values.photo = content;
                        
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


    getPhoto(){
        
        // Promise because the filereader to use methods asynchronous, and promise return two states for result ok or reject
        return new Promise((resolve, reject) => { 
            
            // instance object FileReader 
            let fileReader = new FileReader();

            // Return found item in new array 
            let element = [...this.formEl.elements].filter(item=>{
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

    getValues(){

        let user = {};
        //Iterator of form elements
        [...this.formEl.elements].forEach(function (field, idx) {
          
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


    // HTML formater
    AddLine(dataUser){
       
        //    this.tableEl.innerHTML += `
        let tr = document.createElement("tr");
        tr.innerHTML = 
        `
            <td>
                <img src="${dataUser.photo}" class="img-circle img-sm">
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
    
        this.tableEl.appendChild(tr);
    };


}