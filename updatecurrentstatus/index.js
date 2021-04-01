var Connection = require('tedious').Connection;
var Request = require('tedious').Request;


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
       
        var bcbsriid=req.body.bcbsriid;
        var statuscode = req.body.statuscode ;
        
        
      
        request = new Request("UPDATE returnreport_data_tbl SET currentstatus='"+statuscode+"' where returnreport_data_id='"+bcbsriid+"'", function(err, rowCount) {
         
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
