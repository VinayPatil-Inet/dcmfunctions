var sql = require("mssql");
// var pkgcloud = require('pkgcloud')
// var fs = require('fs')
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
         var uploadedfileid=req.body.uploadedfileid;
        
        var resultedreturnjson=req.body.returnreport;
        for (var i=0;i<resultedreturnjson.length;i++)
        {

            
            var Mbr_Last_Name= resultedreturnjson[i].Mbr_Last_Name;
                  var Mbr_First_Name= resultedreturnjson[i].Mbr_First_Name;
                  var BCBSRI_ID= resultedreturnjson[i].BCBSRI_ID;
                  var Mbr_DOB= resultedreturnjson[i].Mbr_DOB;
                  var BCBSRI_Risk_Categorization= resultedreturnjson[i].BCBSRI_Risk_Categorization;
                  var Perf_Guarantee_Mbr= resultedreturnjson[i].Perf_Guarantee_Mbr;
                  var Practice_Site= resultedreturnjson[i].Practice_Site;
                  var Practice_Identified_Indicator= resultedreturnjson[i].Practice_Identified_Indicator;
                  var Outreach_Attempted_Date= resultedreturnjson[i].Outreach_Attempted_Date;
                  var Enrolled_Status_Date= resultedreturnjson[i].Enrolled_Status_Date;
                  var BH_Screening_PHQ2_PHQ9_Completed_Date= resultedreturnjson[i].BH_Screening_PHQ2_PHQ9_Completed_Date;
                  var Care_Plan_Established_Date= resultedreturnjson[i].Care_Plan_Established_Date;
                  var Discharged_from_CM_Date= resultedreturnjson[i].Discharged_from_CM_Date;
                  var Status= resultedreturnjson[i].Status;
                  var userid= req.body.userid;
                  var currentstatus=1;
                    // if(Outreach_Attempted_Date!='' && Enrolled_Status_Date!='' && BH_Screening_PHQ2_PHQ9_Completed_Date!='' && Care_Plan_Established_Date!='' && Discharged_from_CM_Date!='')
                    if(Discharged_from_CM_Date!='')
                    {
                        currentstatus='2';
                    }
                    else if(Outreach_Attempted_Date=='' && Enrolled_Status_Date=='' && BH_Screening_PHQ2_PHQ9_Completed_Date=='' && Care_Plan_Established_Date=='' && Discharged_from_CM_Date=='')
                    {
                        currentstatus='0';
                    }

            // query to the database and get the records
            request.query("UPDATE returnreport_data_tbl SET uploadedfileid='"+uploadedfileid+"',Mbr_Last_Name='"+Mbr_Last_Name+"',Mbr_First_Name='"+Mbr_First_Name+"',BCBSRI_ID='"+BCBSRI_ID+"',Mbr_DOB='"+Mbr_DOB+"',BCBSRI_Risk_Categorization='"+BCBSRI_Risk_Categorization+"',Perf_Guarantee_Mbr='"+Perf_Guarantee_Mbr+"',Practice_Site='"+Practice_Site+"',Practice_Identified_Indicator='"+Practice_Identified_Indicator+"',Outreach_Attempted_Date='"+Outreach_Attempted_Date+"',Enrolled_Status_Date='"+Enrolled_Status_Date+"',BH_Screening_PHQ2_PHQ9_Completed_Date='"+BH_Screening_PHQ2_PHQ9_Completed_Date+"',Care_Plan_Established_Date='"+Care_Plan_Established_Date+"',Discharged_from_CM_Date='"+Discharged_from_CM_Date+"',Status='"+Status+"', updated_by='"+userid+"',currentstatus='"+currentstatus+"' where uploadedfileid='"+uploadedfileid+"' and BCBSRI_ID='"+BCBSRI_ID+"'", function (err, recordset) {
                
                if (err){
                    console.log(err)

                } 
                else
                {
                       var lastid=2;
                    context.res = {
                        body: lastid
                    };
                    
                    context.done();
                   
                    
                }

                // send records as a response
            
                
                
            });

           
        }
        
    });
	}