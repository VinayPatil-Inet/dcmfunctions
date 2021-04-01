var Connection = require('tedious').Connection;
var Request = require('tedious').Request
var TYPES = require('tedious').TYPES;
// const querystring = require('querystring');

module.exports = async function (context, req) {
    // context.log('JavaScript HTTP trigger function processed a request.'+JSON.stringify(req));
    // context.log('function processed a req.body.'+JSON.stringify(req.body));

     
    var config = {  
        server: 'dcmservername.database.windows.net',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'dcmadmin', //update me
                password: 'dcm@1234'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: true,
            database: 'dcmdatabase'  //update me
        }
    };   
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.  
        //console.log("Connected");  
        executeStatement1();  
    });  
  
     
  
    function executeStatement1() {  
    //     var user_input = querystring.parse(req.body);
    //    var firstn1 = user_input.name //contains Mickey
    //     var lastn = user_input.address    //contains Mouse

    //{"pcmh_name":"test","pcmh_site_name":"testpcm","pcmh_npi_id":"testnpi","pcmh_tax_id":"testtax","pcmh_deignated_user_name":"bcbsri@gmail.com","firstname":"Vinay","lastname":"Patil","email_id":"email@c.com","pcmh_user_id":"pchuserid","password":"123456"}

        // var firstn1 = "Arun" ;//contains Mickey
        //   var lastn = "BGM";    //contains Mouse
        var pcmhid = req.body.pcmh ;//contains Mickey
        // var pcmhid = '1' ;//contains Mickey
        var usertypeid = req.body.usertype;    //contains Mouse
        // var usertypeid = '3';    //contains Mouse
        var username = req.body.pcmh_user_id;    //contains Mouse
        var address = req.body.address;    //contains Mouse
        var phone = req.body.phone_no;    //contains Mouse
        var firstname = req.body.firstname;    //contains Mouse
        var lastname = req.body.lastname;    //contains Mouse
        var emailID = req.body.email;    //contains Mouse
        // var username = req.body.username;    //contains Mouse
        var password = req.body.password;    //contains Mouse

        // request = new Request("INSERT SalesLT.Product (Name, ProductNumber, StandardCost, ListPrice, SellStartDate) OUTPUT INSERTED.ProductID VALUES (@Name, @Number, @Cost, @Price, CURRENT_TIMESTAMP);", function(err) {  
        request = new Request("INSERT into user_tbl(pcmhid,usertypeid,password,username,address,email,phone,isactive,firstname,lastname) OUTPUT INSERTED.userid VALUES ('"+pcmhid+"', '"+usertypeid+"','"+password+"', '"+username+"','"+address+"','"+emailID+"','"+phone+"','1','"+firstname+"','"+lastname+"');", function(err) {  
         if (err) {  
            context.res = {
                body: err
            };
            context.done();
        }  
        });  
        
        request.on('row', function(columns) {  
            columns.forEach(function(column) {  
              if (column.value === null) {  
                context.res = {
                    body: 'null'
                };  
                context.done();
              } else {  
               // console.log("PCMH id of inserted item is " + column.value);  
               
                context.res = {
                    body: column.value
                };
                context.done();
              }  
             
            });  
            
        }); 
              
        connection.execSql(request);  
    }
}