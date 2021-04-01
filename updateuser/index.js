var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata=[];
var rowdata = {};

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

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

        if (err) {
            context.log(err);

            context.res = {
                status: 500,
                body: "Unable to establish a connection."
            };
            context.done();

        } else {
            
          
                executeStatement();
           
        }
    });

    function executeStatement() {
       
        var pcmhid = req.body.pcmh ;//contains Mickey
        var userid = req.body.userid ;//contains Mickey
       
        var usertypeid = req.body.usertype;    //contains Mouse
       
        var username = req.body.pcmh_user_id;    //contains Mouse
        var address = req.body.address;    //contains Mouse
        var phone = req.body.phone_no;    //contains Mouse
        var firstname = req.body.firstname;    //contains Mouse
        var lastname = req.body.lastname;    //contains Mouse
        var emailID = req.body.email;    //contains Mouse
        // var username = req.body.username;    //contains Mouse
        var password = req.body.password;    //contains Mouse  
        // {"firstname":"vdd","lastname":"eeee","userid":"2","phone_no":"4234434332","email":"giri@vi2web.com","pcmh":"1","address":"gfgfgfg","usertype":"3","pcmh_user_id":"bcbsri@gmail.com","password":"123456"}
       
       
      request = new Request("UPDATE user_tbl SET pcmhid='"+pcmhid+"',usertypeid='"+usertypeid+"',username='"+username+"',address='"+address+"',phone='"+phone+"',firstname='"+firstname+"',lastname='"+lastname+"',email='"+emailID+"',password='"+password+"' where userid='"+userid+"'", function(err, rowCount) {
         
        //request = new Request("select * FROM pcmh_tbl where isactive = '" + isactive + "'", function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement1."
                };
                context.done();

            } else {
                context.res = {
                    body: "ok"
                };
                context.done();
            }
        });

        

        connection.execSql(request);
    }


};