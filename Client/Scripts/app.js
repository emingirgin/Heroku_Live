"use strict";
// IIFE -- Immediately Invoked Function Expression
exports.__esModule = true;
// AKA -- Anonymous Self-Executing Function
(function () {
    function AuthGuard() {
        var protected_routes = [
            "/contact-list",
            "/edit"
        ];
        if (protected_routes.indexOf(location.pathname) > -1) {
            // check if user is logged in
            if (!sessionStorage.getItem("user")) {
                // if not...change the active link to the  login page
                location.href = "/login";
            }
        }
    }
    function DisplayHomePage() {
        console.log("Home Page");
        $("#AboutUsButton").on("click", function () {
            location.href = "/about";
        });
    }
    function DisplayProductsPage() {
        console.log("Products Page");
    }
    function DisplayServicesPage() {
        console.log("Services Page");
    }
    function DisplayAboutPage() {
        console.log("About Page");
    }
    /**
     *This function adds a Contact object to localStorage
     *
     * @param {string} fullName
     * @param {string} contactNumber
     * @param {string} emailAddress
     */
    function AddContact(fullName, contactNumber, emailAddress) {
        var contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            var key = contact.FullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    /**
     * This method validates a field in the form and displays an error in the message area div element
     *
     * @param {string} fieldID
     * @param {RegExp} regular_expression
     * @param {string} error_message
     */
    function ValidateField(fieldID, regular_expression, error_message) {
        var messageArea = $("#messageArea").hide();
        $("#" + fieldID).on("blur", function () {
            var text_value = $(this).val();
            if (!regular_expression.test(text_value)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function ContactFormValidation() {
        ValidateField("fullName", /^([A-Z][a-z]{1,3}.?\s)?([A-Z][a-z]{1,})((\s|,|-)([A-Z][a-z]{1,}))*(\s|,|-)([A-Z][a-z]{1,})$/, "Please enter a valid Full Name. This must include at least a Capitalized First Name and a Capitalized Last Name.");
        ValidateField("contactNumber", /^(\+\d{1,3}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid Contact Number. Example: (416) 555-5555");
        ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid Email Address.");
    }
    function DisplayContactPage() {
        console.log("Contact Page");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            location.href = "/contact-list";
        });
        ContactFormValidation();
        var sendButton = document.getElementById("sendButton");
        var subscribeCheckbox = document.getElementById("subscribeCheckbox");
        sendButton.addEventListener("click", function (event) {
            if (subscribeCheckbox.checked) {
                var fullName = document.forms[0].fullName.value;
                var contactNumber = document.forms[0].contactNumber.value;
                var emailAddress = document.forms[0].emailAddress.value;
                var contact = new core.Contact(fullName, contactNumber, emailAddress);
                if (contact.serialize()) {
                    var key = contact.FullName.substring(0, 1) + Date.now();
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
    }
    function DisplayContactListPage() {
        if (localStorage.length > 0) {
            var contactList = document.getElementById("contactList");
            var data_1 = "";
            var keys = Object.keys(localStorage); // returns a list of keys from localStorage
            var index = 1;
            // for every key in the keys string array
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var contactData = localStorage.getItem(key); // get localStorage data value
                var contact = new core.Contact(); // create an empty Contact object
                contact.deserialize(contactData);
                data_1 += "<tr>\n                <th scope=\"row\" class=\"text-center\">".concat(index, "</th>\n                <td>").concat(contact.FullName, "</td>\n                <td>").concat(contact.ContactNumber, "</td>\n                <td>").concat(contact.EmailAddress, "</td>\n                <td class=\"text-center\"><button value=\"").concat(key, "\" class=\"btn btn-primary btn-sm edit\"><i class=\"fas fa-edit fa-sm\"></i> Edit</button></td>\n                <td class=\"text-center\"><button value=\"").concat(key, "\" class=\"btn btn-danger btn-sm delete\"><i class=\"fas fa-trash-alt fa-sm\"></i> Delete</button></td>\n                </tr>");
                index++;
            }
            contactList.innerHTML = data_1;
            $("button.delete").on("click", function () {
                if (confirm("Are you sure?")) {
                    localStorage.removeItem($(this).val());
                }
                location.href = "/contact-list";
            });
            $("button.edit").on("click", function () {
                location.href = "/edit#" + $(this).val();
            });
        }
        $("#addButton").on("click", function () {
            location.href = "/edit#add";
        });
    }
    /**
     * This function allows JavaScript to work on the Edit Page
     */
    function DisplayEditPage() {
        console.log("Edit Page");
        ContactFormValidation();
        var page = router.LinkData;
        switch (page) {
            case "add":
                {
                    $("main>h1").text("Add Contact");
                    $("#editButton").html("<i class=\"fas fa-plus-circle fa-lg\"></i> Add");
                    $("#editButton").on("click", function (event) {
                        event.preventDefault();
                        var fullName = document.forms[0].fullName.value;
                        var contactNumber = document.forms[0].contactNumber.value;
                        var emailAddress = document.forms[0].emailAddress.value;
                        AddContact(fullName, contactNumber, emailAddress);
                        location.href = "/contact-list";
                    });
                    $("#cancelButton").on("click", function () {
                        location.href = "/contact-list";
                    });
                }
                break;
            default:
                {
                    // get contact info from localStorage
                    var contact_1 = new core.Contact();
                    contact_1.deserialize(localStorage.getItem(page));
                    // display the contact in the edit form
                    $("#fullName").val(contact_1.FullName);
                    $("#contactNumber").val(contact_1.ContactNumber);
                    $("#emailAddress").val(contact_1.EmailAddress);
                    $("#editButton").on("click", function (event) {
                        event.preventDefault();
                        // get changes from the page
                        contact_1.FullName = $("#fullName").val();
                        contact_1.ContactNumber = $("#contactNumber").val();
                        contact_1.EmailAddress = $("#emailAddress").val();
                        // replace the item in local storage
                        localStorage.setItem(page, contact_1.serialize());
                        // go back to the contact list page (refresh)
                        location.href = "/contact-list";
                    });
                    $("#cancelButton").on("click", function () {
                        location.href = "/contact-list";
                    });
                }
                break;
        }
    }
    function CheckLogin() {
        // if user is logged in
        if (sessionStorage.getItem("user")) {
            // swap out the login link for logout
            $("#login").html("<a id=\"logout\" class=\"nav-link\" href=\"#\"><i class=\"fas fa-sign-out-alt\"></i> Logout</a>");
            $("#logout").on("click", function () {
                // perform logout
                sessionStorage.clear();
                // swap out the logout link for login
                $("#login").html("<a class=\"nav-link\" data=\"login\"><i class=\"fas fa-sign-in-alt\"></i> Login</a>");
                // redirect back to login
                location.href = "/login";
            });
        }
    }
    function DisplayLoginPage() {
        console.log("Login Page");
        var messageArea = $("#messageArea");
        messageArea.hide();
        $("#loginButton").on("click", function () {
            var success = false;
            // create an empty user object
            var newUser = new core.User();
            // uses jQuery shortcut to load the users.json file
            $.get("./Data/users.json", function (data) {
                // for every user in the users.json file
                for (var _i = 0, _a = data.users; _i < _a.length; _i++) {
                    var user = _a[_i];
                    var username = document.forms[0].username.value;
                    var password = document.forms[0].password.value;
                    // check if the username and password entered in the form matches this user
                    if (username == user.Username && password == user.Password) {
                        // get the user data from the file and assign to our empty user object
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                // if username and password matches - success.. the perform the login sequence
                if (success) {
                    // add user to session storage
                    sessionStorage.setItem("user", newUser.serialize());
                    // hide any error message
                    messageArea.removeAttr("class").hide();
                    // redirect the user to the secure area of our site - contact-list.html
                    location.href = "/contact-list";
                }
                // else if bad credentials were entered...
                else {
                    // display an error message
                    $("#username").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
                }
            });
        });
        $("#cancelButton").on("click", function () {
            // clear the login form
            document.forms[0].reset();
            // return to the home page
            location.href = "/home";
        });
    }
    function DisplayRegisterPage() {
        console.log("Register Page");
    }
    function Display404Page() {
        location.href = "/home";
    }
    // named function option
    /**
     * This is the entry point to the web application
     *
     */
    function Start() {
        console.log("App Started!");
        var page_id = $("body")[0].getAttribute("id");
        switch (page_id) {
            case "home":
                DisplayHomePage();
                break;
            case "about":
                DisplayAboutPage();
                break;
            case "products":
                DisplayProductsPage();
                break;
            case "services":
                DisplayServicesPage();
                break;
            case "contact":
                DisplayContactPage();
                break;
            case "contact-list":
                AuthGuard();
                DisplayContactListPage();
                break;
            case "edit":
                AuthGuard();
                DisplayEditPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
            case "register":
                DisplayRegisterPage();
                break;
            case "404":
                Display404Page();
                break;
        }
    }
    window.addEventListener("load", Start);
})();
