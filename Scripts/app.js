// IIFE -- Immediately Invoked Function Expression
// AKA -- Anonymous Self-Executing Function
(function()
{
    
    /**
     * AJAX function to open a connection to the server and returns data
     * to the callback function
     *
     * @param {string} method
     * @param {string} url
     * @param {function} callback
     */
     function AjaxRequest(method, url, callback)
    {
                // AJAX CODE SECTION
        // Creating an XHR Object
        let XHR = new XMLHttpRequest();

        // Adding event listener for readystatechange
        XHR.addEventListener("readystatechange", () =>
        {
            if(XHR.readyState === 4 && XHR.status === 200)
            {
                if(typeof callback === "function")
                {
                    callback(XHR.responseText);
                }
                else
                {
                    console.error("ERROR: callback not a function");
                }
            }
        });

        // Step 3. - Open a connection to the server
        XHR.open(method, url);

        // Step 4. - Send the request to the server
        XHR.send();
    }
    
    /**
    * Function that loads header.html 
    *
    * @param {string} html_data
    */
    function LoadHeader()
    {
        $.get(`./Views/components/header.html`, function(html_data)
        {
            $("header").html(html_data);
            document.title = router.ActiveLink.substring(0, 1).toUpperCase() + router.ActiveLink.substring(1);
            //TODO: this needs to be fixed
            $(`li>a:contains(${document.title})`).addClass("active"); // update active link

            CheckLogin();
            
        });
    }

    /**
     * 
     * @param {string} activeLink 
     * @param {function} callback 
     * @returns {void}
     */
     function LoadContent()
     {
         let page_name = router.ActiveLink; // Storing Activelink inside of the variable
         let callback = ActiveLinkCallBack(); // returns a reference to the correct function
        $.get(`./Views/content/${page_name}.html`, function(html_data)
        {
            $("main").html(html_data);
            callback(); // calling the correct function
            
        });
     }
 
     /**
      *
      * @returns {void}
      */
     function LoadFooter()
     {
        $.get(`./Views/components/footer.html`, function(html_data)
        {
            $("footer").html(html_data);            
        });
     }

    function DisplayHomePage()
    {
        console.log("Home Page");
        // Changing background image on the page.
        document.body.style.backgroundImage = "url('./pictures/index-bg.png')";
        $("#AboutUsButton").on("click", () => 
        {
            location.href = "/about";
        });
    
        $("main").append(`<p id="MainParagraph" class="mt-3">This is the Main Paragraph</p>`);
        $("body").append(`<article class="container">
        <p id="ArticleParagraph" class ="mt-3">This is the Article Paragraph</p>
        </article>`);

    }


    function DisplayProductsPage()
    {
        console.log("Products Page");
    }

    function DisplayServicesPage()
    {
        console.log("Services Page");
    }

    function DisplayAboutPage()
    {
        console.log("About Page");
    }

    /**
     *This function adds a Contact object to localStorage
     *
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName, contactNumber, emailAddress)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize())
        {
            let key = contact.FullName.substring(0, 1) + Date.now();

            localStorage.setItem(key, contact.serialize());
        }
    }

    function DisplayContactPage()
    {
        console.log("Contact Page");

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(event)
        {

            if(subscribeCheckbox.checked)
            {
                let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);
                if(contact.serialize())
                {
                    let key = contact.FullName.substring(0, 1) + Date.now();

                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
        // ading contact-list button to see for logged in users
        if(sessionStorage.getItem("user"))
        {
            $("#contactListButton").html(
                `<a href="/contact-list" class="btn btn-primary btn-lg"><i class="fas fa-envelope fa-lg"></i> Show Contact List</a>`
            );
        }
    }

    function DisplayContactListPage()
    {
        console.log("Display ContactList Page");
        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList");

            let data = "";

            let keys = Object.keys(localStorage); // returns a list of keys from localStorage

            let index = 1;

            // for every key in the keys string array
            for(const key of keys)
            {
                let contactData = localStorage.getItem(key); // get localStorage data value

                let contact = new core.Contact(); // create an empty Contact object
                contact.deserialize(contactData);

                data += `<tr>
                <th scope="row" class="text-center">${index}</th>
                <td>${contact.FullName}</td>
                <td>${contact.ContactNumber}</td>
                <td>${contact.EmailAddress}</td>
                <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
                <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
                </tr>`;

                index++;
            }

            contactList.innerHTML = data;

            // delete button function
            $("button.delete").on("click", function()
            {
                // user validation for the remove process
                if(confirm("Are you sure?"))
                {
                    localStorage.removeItem($(this).val())
                }
                location.href = "/contact-list";
            });
            // edit button
            $("button.edit").on("click", function()
            {
                location.href = "/edit#" + $(this).val();
            });
        }
        // add button
        $("#addButton").on("click", ()=>
        {
            location.href = "/edit#add";
        });
    }

    function DisplayEditPage()
    {
        console.log("Edit Page");

        ContactFormValidation();

        let page = location.hash.substring(1);

        switch(page)
        {
            case "add":
                {
                    $("main>h1").text("Add Contact");

                    $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`)

                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();
                        AddContact(fullName.value, contactNumber.value, emailAddress.value);
                        location.href = "/contact-list";
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "/contact-list";
                    });
                }
                break;
            default:
                {
                    // getting contact object details from the local storage
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));

                    // passing details to the textboxes in edit form
                    $("#fullName").val(contact.FullName);
                    $("#contactNumber").val(contact.ContactNumber);
                    $("#emailAddress").val(contact.EmailAddress);

                    $("#editButton").on("click", (event) =>
                    {
                        event.preventDefault();
                        
                        // get changes from the page
                        contact.FullName = $("#fullName").val();
                        contact.ContactNumber = $("#contactNumber").val();
                        contact.EmailAddress = $("#emailAddress").val();

                        // replace the item in local storage
                        localStorage.setItem(page, contact.serialize());
                        // go back to the contact list page (refresh)
                        location.href = "/contact-list";
                    });

                    $("#cancelButton").on("click", () =>
                    {
                        location.href = "/contact-list";
                    });
                    
                }
                break;
        }
    }

    function DisplayLoginPage()
    {
        console.log("Login Page");
        let messageArea =  $("#messageArea");
        messageArea.hide();

        $("#loginButton").on("click", function()
        {
            let success = false;
            // create an empty user object
            let newUser = new core.User();

            // uses jQuery shortcut to load the users.json file
            $.get("./Data/users.json", function(data)
            {
                // for every user in the users.json file
                for (const user of data.users) 
                {
                    // check if the username and password entered in the form matches this user
                    if(username.value == user.Username && password.value == user.Password)
                    {
                        // get the user data from the file and assign to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }

                 // if username and password matches - check the success after loading the js
                 // inside the json load
                if(success)
                {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize());

                    // hide any error message
                    messageArea.removeAttr("class").hide();

                    // redirect the user to the secure area of our site - contact-list.html
                    location.href = "/contact-list";
                }
                // else if bad credentials were entered...
                else
                {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                }
            });
        });

        $("#cancelButton").on("click", function()
        {
            // clear the login form
            document.forms[0].reset();

            // return to the home page
            location.href = "/home";
        });
    }

    function CheckLogin()
    {
        // if user logged in
        if(sessionStorage.getItem("user"))
        {
            // swap out login link for logout
            $("#login").html(
                `<a id="logout" class="nav-link" href="#"><i class="fas fa-sign-out-alt"></i> Logout</a>`
            );


            $("#logout").on("click",function()
            {
                // performing logout process
                sessionStorage.clear();

                // redirecting back to login page
                location.href = "/login"
            });
        }
    }

    function DisplayRegisterPage()
    {
        console.log("Register Page");
    }

     /**
     * Method that takes validates user input with given regEx
     *
     * @param {string} fieldID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
         function ValidateField(fieldID, regular_expression, error_message)
         {
             let messageArea = $("#messageArea").hide();
         
             $("#" + fieldID).on("blur", function()
             {
                 let text_value = $(this).val();
                 if(!regular_expression.test(text_value))
                 {
                     $(this).trigger("focus").trigger("select");
                     messageArea.addClass("alert alert-danger").text(error_message).show();
                 }
                 else
                 {
                     messageArea.removeAttr("class").hide();
                 }
             });
         }
     
         function ContactFormValidation()
         {
             ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must include at least a Capitalized First Name and a Capitalized Last Name.");
             ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
             ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
         }

         function Display404Page()
         {
     
         }
     
         /**
          * This methid returns the function relative to active link.
          *
          * @returns {function}
          */
         function ActiveLinkCallBack()
         {
             switch(router.ActiveLink)
             {
                 case "home": return DisplayHomePage;
                 case "about": return DisplayAboutPage;
                 case "products": return DisplayProductsPage;
                 case "services": return DisplayServicesPage;
                 case "contact": return DisplayContactPage;
                 case "contact-list": return DisplayContactListPage;
                 case "edit": return DisplayEditPage;
                 case "login": return DisplayLoginPage;
                 case "register": return DisplayRegisterPage;
                 case "404": return Display404Page;
                 default:
                     console.error("ERROR: callback does not exist: " + activeLink);
                     break;
             }
         }

    // named function option
    function Start()
    {
        console.log("App Started!");

        LoadHeader();

        LoadContent();

        LoadFooter();
       
    }

    function MyFunction()
    {
        console.log("Test Function!");
    }

    window.addEventListener("load", Start);
    window.addEventListener("load", MyFunction);

})();