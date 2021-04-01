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
       
        var pcmhid=req.body.pcmhid;
        var pcmhname = req.body.pcmh_name ;
        var pcmhsitename = req.body.pcmh_site_name;   
        var pcmhNPI_ID = req.body.pcmh_npi_id;    
        var pcmhTax_ID = req.body.pcmh_tax_id;    
        var pcmh_dgn_username = req.body.pcmh_deignated_user_name;   
        var firstname = req.body.firstname;  
        var lastname = req.body.lastname;    
        var emailID = req.body.email_id;    
       /* var pcmhuserid = req.body.pcmh_user_id;   
        var password = req.body.password;    
        if(password!=="")
        {
            var update_pass=",password="+req.body.password;
        }
        else
        {
            var update_pass="";
        }
*/
      request = new Request("UPDATE pcmh_tbl SET pcmhname='"+pcmhname+"',pcmhsitename='"+pcmhsitename+"',pcmhNPI_ID='"+pcmhNPI_ID+"',pcmhTax_ID='"+pcmhTax_ID+"',pcmh_dgn_username='"+pcmh_dgn_username+"',firstname='"+firstname+"',lastname='"+lastname+"',emailID='"+emailID+"' where pcmhid='"+pcmhid+"'", function(err, rowCount) {
         
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