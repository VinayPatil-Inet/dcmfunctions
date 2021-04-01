var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var resultdata={};
var recentrowdata = [];
var inprocessrowdata=[];
var complatedrowdata=[];
var rowdata = [];


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

            var url = new URL(req.originalUrl);
            var searchParams = new URLSearchParams(url.search);
            
            
            var uploadedfileid = searchParams.get('uploadedfileid');
            var currentstatus = searchParams.get('currentstatus');
            var usertype=searchParams.get('usertype');
           

           
                complated_review_return_report_individual_view(uploadedfileid,currentstatus,usertype);
           
            
        }

        
    });

    

    function complated_review_return_report_individual_view(uploadedfileid,currentstatus,usertype) {
        var url = new URL(req.originalUrl);
        var searchParams = new URLSearchParams(url.search);
        var start  = searchParams.get('start');
        var draw = searchParams.get('draw');
        var length = searchParams.get('length');

        var month = searchParams.get('month');
        var year = searchParams.get('year');

        if(month!="")
        {
            var month_q = "and for_month="+month;
         }
            else
            {
                var month_q = "";
            }

            if(year!="")
            {
            var year_q = "and for_year="+year;
            }
            else
            {
                var year_q = "";
            }
            
        var search = searchParams.get('search[value]');

            if(search!="")
            {
                var search_q = "and (for_year LIKE '%"+search+"%' OR Mbr_Last_Name LIKE '%"+search+"%' OR Mbr_First_Name LIKE '%"+search+"%' OR BCBSRI_Risk_Categorization LIKE '%"+search+"%' OR BCBSRI_ID LIKE '%"+search+"%')";
            }
            else
            {
                var search_q="";
            }
       
        if(usertype=="PCMH")
        {
            if(uploadedfileid!="")
            {
                var query = "select *,(select count(*) from returnreport_data_tbl where uploadedfileid='"+uploadedfileid+"' "+month_q+" "+year_q+" "+search_q+" and currentstatus='"+currentstatus+"' ) as totalrec,monthname as month_name FROM returnreport_data_tbl WHERE uploadedfileid='"+uploadedfileid+"' "+month_q+" "+year_q+" "+search_q+" and currentstatus='"+currentstatus+"' ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
            }
            else
            {
                //Display All return report individual for logged in pcmh
                var month_forall = searchParams.get('month');
                var year_forall = searchParams.get('year');

                if(month_forall!="")
                {
                    var month_forall_q = "and returnreport_data_tbl.for_month="+month_forall;
                }
                    else
                    {
                        var month_forall_q = "";
                    }

                    if(year_forall!="")
                    {
                    var year_forall_q = "and returnreport_data_tbl.for_year="+year_forall;
                    }
                    else
                    {
                        var year_forall_q = "";
                    }

                var search_forall = searchParams.get('search[value]');

                    if(search_forall!="")
                    {
                        var search_q_forall = "and (returnreport_data_tbl.for_year LIKE '%"+search_forall+"%' OR returnreport_data_tbl.Mbr_Last_Name LIKE '%"+search_forall+"%' OR returnreport_data_tbl.Mbr_First_Name LIKE '%"+search_forall+"%' OR returnreport_data_tbl.BCBSRI_Risk_Categorization LIKE '%"+search_forall+"%' OR returnreport_data_tbl.BCBSRI_ID LIKE '%"+search_forall+"%')";
                    }
                    else
                    {
                        var search_q_forall="";
                    }

                var pcmh_id = searchParams.get('pcmhid');
                 var query = "select *,(select count(*) from uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' "+month_forall_q+" "+year_forall_q+" "+search_q_forall+" and returnreport_data_tbl.currentstatus='"+currentstatus+"') as totalrec, returnreport_data_tbl.monthname as month_name  FROM uploadedfiles_tbl inner join returnreport_data_tbl on returnreport_data_tbl.uploadedfileid=uploadedfiles_tbl.uploadedfileid where uploadedfiles_tbl.pcmh_id='"+pcmh_id+"' "+month_forall_q+" "+year_forall_q+" "+search_q_forall+" and returnreport_data_tbl.currentstatus='"+currentstatus+"'  ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY" ;
            }
        }
        else
        {
            var query = "select *,(select count(*) from returnreport_data_tbl where uploadedfileid='"+uploadedfileid+"' "+month_q+" "+year_q+" "+search_q+" and currentstatus='"+currentstatus+"' ) as totalrec,pcmhname FROM returnreport_data_tbl LEFT JOIN pcmh_tbl on pcmh_tbl.pcmhid=returnreport_data_tbl.updated_by  WHERE uploadedfileid='"+uploadedfileid+"' "+month_q+" "+year_q+" "+search_q+" and currentstatus='"+currentstatus+"'  ORDER BY returnreport_data_id DESC OFFSET "+start+" ROWS FETCH NEXT "+length+" ROWS ONLY";
        }

        request = new Request(query, function(err, rowCount) {
            if (err) {
                context.log(err);

                context.res = {
                    status: 500,
                    body: "Failed to connect to execute statement."
                };
                context.done();

            } else {
                context.log(rowCount + ' rows');
            }
        });

        complatedrowdata=[];
        request.on('row', function(columns) {
            var complatedrowObject = {};
            columns.forEach(function(column) {
               /* if (column.value === null) {
                    console.log('NULL');
                } else {
                    //context.log(column.value);
                    complatedrowObject[column.metadata.colName] = column.value;
                // resultdata.push(column.value)
                }*/
                complatedrowObject[column.metadata.colName] = column.value;
              
            });
           
            complatedrowdata.push(complatedrowObject);
        });

        request.on('doneProc', function (rowCount, more, returnStatus, rows) {

            var data = JSON.stringify({
                "draw": draw,
                "recordsFiltered": complatedrowdata[0].totalrec,
                "recordsTotal": complatedrowdata[0].totalrec,
                "data": complatedrowdata
                });
            context.res = {
                        body: data
                    };
                    
                    context.done();
        });

        connection.execSql(request);
    }



};