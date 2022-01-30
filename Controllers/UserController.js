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

            let values = this.getValues();
            
            // rewrite image 
            values.photo = "";

            this.getPhoto();

            // Add Line on table for each user
            this.AddLine(values);        
        });

    }


    getPhoto(){
        // instance object FileReader 
        let fileReader = new FileReader();

        let element = [...this.formEl.elements].filter(item=>{

            if(item.name == 'photo'){
                return item;
            }
        })

        console.log(element);
        // When load image 
        fileReader.onload = () => {

        };

        fileReader.readAsDataURL();
    }

    getValues(){

        let user = {};
        //Iterator of form elements
        [...this.formEl.elements].forEach(function (field, idx) {
          
            if(field.name == 'gender'){
                if(field.checked){
                    user[field.name] = field.value;
                }
            }else{
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
       
        this.tableEl.innerHTML += `
        <tr>
            <td>
                <img src="${dataUser.photo}" class="img-circle img-sm">
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
    </tr>`;
    
    };


}