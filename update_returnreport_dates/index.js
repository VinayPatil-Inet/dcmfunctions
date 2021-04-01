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
       
        var bcbsriid=req.body.bcbsriid;
        var Outreach_Attempted_Date = req.body.outreach_attempted_date ;
        var Enrolled_Status_Date = req.body.enrolled_status_date;   
        var BH_Screening_PHQ2_PHQ9_Completed_Date = req.body.bh_screening_phq2_phq9_completed_date;    
        var Care_Plan_Established_Date = req.body.care_plan_established_date;    
        var Discharged_from_CM_Date = req.body.discharged_from_cm_date;   
        var userid = req.body.userid;   
        
      
      request = new Request("UPDATE returnreport_data_tbl SET Outreach_Attempted_Date='"+Outreach_Attempted_Date+"',Enrolled_Status_Date='"+Enrolled_Status_Date+"',BH_Screening_PHQ2_PHQ9_Completed_Date='"+BH_Screening_PHQ2_PHQ9_Completed_Date+"',Care_Plan_Established_Date='"+Care_Plan_Established_Date+"',Discharged_from_CM_Date='"+Discharged_from_CM_Date+"', updated_by='"+userid+"' where returnreport_data_id='"+bcbsriid+"'", function(err, rowCount) {
         
        //request = new Request("select * FROM pcmh_tbl where isactive = '" + isactive + "'", function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement1."
                };
                context.done();

            } else {
                // context.res = {
                //     body: "ok"
                // };
               checkcurrentstatus(bcbsriid);

               // context.done();
            }
        });

        

        connection.execSql(request);
    }

   function checkcurrentstatus(bcbsriid)
    {
        
        request = new Request("select Outreach_Attempted_Date,Enrolled_Status_Date,BH_Screening_PHQ2_PHQ9_Completed_Date,Care_Plan_Established_Date,Discharged_from_CM_Date FROM returnreport_data_tbl where  returnreport_data_id = '" + bcbsriid + "'", function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement1."
                };
                context.done();

            } else {
                context.log(rowCount + ' rows');
            }
        });

        request.on('row', function(columns) {
            columns.forEach(function(column) {
               
                //context.log(column.value);
                rowdata[column.metadata.colName] = column.value;
                //   var  date1 = columns[0].value;
                //   var  date2 = columns[1].value;
                //   var  date3 = columns[2].value;
                //   var  date4 = columns[3].value;
                //   var  date5 = columns[4].value;
               // resultdata.push(column.value)
            //    if(date1!='' && date2!='' && date3!='' && date4!='' && date5!='')
            //    {
                    // updatecurrentstatus(5,bcbsriid);
            //    }
            //    else
            //    {
            //          updatecurrentstatus(1,bcbsriid);
            //    }
               
              
            });
            resultdata.push(rowdata);
            //context.log(resultdata);
            context.res = {
                body: rowdata
            };
            
            context.done();
        });

        connection.execSql(request);

    }

   function updatecurrentstatus(statuscode,bcbsriid)
    {

        request = new Request("UPDATE returnreport_data_tbl SET currentstatus='"+statuscode+"' where BCBSRI_ID='"+bcbsriid+"'", function(err, rowCount) {
         
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
