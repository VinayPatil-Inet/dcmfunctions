
var sql = require("mssql");
// var pkgcloud = require('pkgcloud')
// var fs = require('fs')
var lastinsid;
module.exports = async function (context, req) {
    // context.log('JavaScript HTTP trigger function processed a request.');

    // config for your database
    var config = {
        user: 'dcmadmin',
        password: 'dcm@1234',
        server: 'dcmservername.database.windows.net', 
        database: 'dcmdatabase',
    };

   
    // connect to your database
   var connection= sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        

            
            var filename= "hello";
            var userid= 2;
            var for_month= "7";
            var for_year= "2020";
            var pcmh_id= "2";
            var status= 'Recent';
            var iscompleted= 0;


            // query to the database and get the records
            request.query("INSERT into uploadedfiles_tbl(filename,userid,for_month,for_year,status,iscompleted,pcmh_id) VALUES ('"+filename+"', '"+userid+"', '"+for_month+"', '"+for_year+"', '"+status+"', '"+iscompleted+"', '"+pcmh_id+"');", function (err, recordset) {
                
                if (err){
                    // console.log(err);
                    console.log('Errproo.');
                } 
                else
                {


                    // lastid=2;
                    // context.res = {
                    //     body: "hellooooo"
                    // };
                    
                    // context.done();
                    console.log('Insert complete.');

                    var str = "SELECT @@IDENTITY AS 'identity'";
                    request = new sql.Request(connection);
                    request.query(str, function(suberr, subdata)
                    {
                        console.log("Querying @@Indentity : "+subdata.recordset);
                        console.log(subdata.recordset[0].identity);   // -> RETURNED NOTHING
                    });
                }

                // send records as a response
            
                
                
            });
            

            // request.on('row', function(columns) {
            //     console.log('New id: %d', columns[0].value);
            //     insertotherdata(columns[0].value);
            // });  
            
            // request.on('row', function(columns) {
            //     console.log('New id: %d', columns[0].value);
            //     // lastinsid=columns[0].value;
            // });

            // request.on('doneProc', function (rowCount, more, returnStatus, rows) {
            //     //console.log(rowCount + ' rows returned');
            //     console.log("rowsmmmm ") // this is the full array of row objects
                
            // });
       
        
    });

   
}