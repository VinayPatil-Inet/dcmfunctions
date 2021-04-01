
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
        var allresultedjson=req.body.pcmh;
        for (var j=0;j<allresultedjson.length;j++)
        {

            
            var filename= req.body.filename;
            var userid= req.body.userid;
            var for_month= req.body.for_month;
            var for_year= req.body.for_year;
            var monthname= req.body.monthname;
            var pcmh_id= allresultedjson[j].id;
            var status= 'Recent';
            var iscompleted= 0;


            // query to the database and get the records
            request.query("INSERT into uploadedfiles_tbl(filename,userid,for_month,for_year,status,iscompleted,pcmh_id,monthname) VALUES ('"+filename+"', '"+userid+"', '"+for_month+"', '"+for_year+"', '"+status+"', '"+iscompleted+"', '"+pcmh_id+"', '"+monthname+"');", function (err, recordset) {
                
                if (err){
                    console.log(err)

                } 
                else
                {


                    // var lastid=2;
                    // context.res = {
                    //     body: lastid
                    // };
                    
                    // context.done();
                    var str = "SELECT @@IDENTITY AS 'identity'";
                    request = new sql.Request(connection);
                    request.query(str, function(suberr, subdata)
                    {
                        console.log("Querying @@Indentity : "+subdata.recordset);
                        console.log(subdata.recordset[0].identity);   // -> RETURNED NOTHING
                        insertotherdata(subdata.recordset[0].identity,pcmh_id);
                        
                    });
                       
                    
                    
                    
                }

                // send records as a response
            
                
                
            });

            // request.on('row', function(columns) {
            //     console.log('New id: %d', columns[0].value);
            //     insertotherdata(columns[0].value);
            // });   
        }
        
    });

    function insertotherdata(lastinsertid,pcmhid)
    {
        return new Promise((resolve, reject) => {
        var request = new sql.Request();
         // res.send(recordset);
         var lastinsertedid= lastinsertid;
         var resulteddemojson=req.body.demographics;
          if(resulteddemojson.length>0)
          {
              
              for (var i=0;i<resulteddemojson.length;i++)
              {
                  var uploadedfileid= lastinsertedid;
                  
                  var Mbr_Last_Name= resulteddemojson[i].Mbr_Last_Name;
                  var Mbr_First_Name= resulteddemojson[i].Mbr_First_Name;
                  var CONSISTENT_MEMBER_ID= resulteddemojson[i].CONSISTENT_MEMBER_ID;
                  var BCBSRI_ID= resulteddemojson[i].BCBSRI_ID;
                  var Mbr_DOB= resulteddemojson[i].Mbr_DOB;
                  var Mbr_Age= resulteddemojson[i].Mbr_Age;
                  var Mbr_Gender= resulteddemojson[i].Mbr_Gender;
                  var BCBSRI_Risk_Categorization= resulteddemojson[i].BCBSRI_Risk_Categorization;
                  var New_PCMH_HR_Flag= resulteddemojson[i].New_PCMH_HR_Flag;
                  var Perf_Guarantee_Mbr= resulteddemojson[i].Perf_Guarantee_Mbr;
                  var contracted_group_name= resulteddemojson[i].contracted_group_name;
                  var Practice_Site= resulteddemojson[i].Practice_Site;
                  var PCP_Last_Name= resulteddemojson[i].PCP_Last_Name;
                  var PCP_First_name= resulteddemojson[i].PCP_First_name;
                  var Last_PCP_Visit_dt= resulteddemojson[i].Last_PCP_Visit_dt;
                  var Product= resulteddemojson[i].Product;
                  var Requires_PCP_Referral= resulteddemojson[i].Requires_PCP_Referral;
                  var Medicare_Dual_Coverage_Type= resulteddemojson[i].Medicare_Dual_Coverage_Type;
                  var Mbr_Addr1= resulteddemojson[i].Mbr_Addr1;
                  var Mbr_Addr2= resulteddemojson[i].Mbr_Addr2;
                  var Mbr_City= resulteddemojson[i].Mbr_City;
                  var Mbr_State= resulteddemojson[i].Mbr_State;
                  var Mbr_Zip= resulteddemojson[i].Mbr_Zip;
                  var Mbr_Phone_Nbr= resulteddemojson[i].Mbr_Phone_Nbr;
                  var for_month= req.body.for_month;
                  var for_year= req.body.for_year;
                  var monthname= req.body.monthname;
                  var inserted_by= req.body.userid;
                  var pcmh_id= pcmhid;

                  // query to the database and get the records
                  request.query("INSERT into demographic_data_tbl(uploadedfileid,Mbr_Last_Name,Mbr_First_Name,CONSISTENT_MEMBER_ID,BCBSRI_ID,Mbr_DOB,Mbr_Age,Mbr_Gender,BCBSRI_Risk_Categorization,New_PCMH_HR_Flag,Perf_Guarantee_Mbr,contracted_group_name,Practice_Site,PCP_Last_Name,PCP_First_name,Last_PCP_Visit_dt,Product,Requires_PCP_Referral,Medicare_Dual_Coverage_Type,Mbr_Addr1,Mbr_Addr2,Mbr_City,Mbr_State,Mbr_Zip,Mbr_Phone_Nbr,for_month,for_year,inserted_by,pcmh_id,monthname) VALUES ('"+uploadedfileid+"', '"+Mbr_Last_Name+"', '"+Mbr_First_Name+"', '"+CONSISTENT_MEMBER_ID+"', '"+BCBSRI_ID+"', '"+Mbr_DOB+"', '"+Mbr_Age+"', '"+Mbr_Gender+"', '"+BCBSRI_Risk_Categorization+"', '"+New_PCMH_HR_Flag+"', '"+Perf_Guarantee_Mbr+"', '"+contracted_group_name+"', '"+Practice_Site+"', '"+PCP_Last_Name+"', '"+PCP_First_name+"', '"+Last_PCP_Visit_dt+"', '"+Product+"', '"+Requires_PCP_Referral+"', '"+Medicare_Dual_Coverage_Type+"', '"+Mbr_Addr1+"', '"+Mbr_Addr2+"', '"+Mbr_City+"', '"+Mbr_State+"', '"+Mbr_Zip+"', '"+Mbr_Phone_Nbr+"', '"+for_month+"', '"+for_year+"', '"+inserted_by+"', '"+pcmhid+"', '"+monthname+"');", function (err, recordset) {
                      
                      if (err) {
                        reject(error)
                        console.log(err)
                    }

                      // send records as a response
                  
                     // res.send(recordset);
                     resolve(recordset)
                      
                  });
              }
          }
          var resultedcondjson=req.body.conditionsandrisk;
          if(resultedcondjson.length>0)
          {
              
              for (var i=0;i<resultedcondjson.length;i++)
              {
                  var uploadedfileid= lastinsertedid;
                  var Mbr_Last_Name= resultedcondjson[i].Mbr_Last_Name;
                  var Mbr_First_Name= resultedcondjson[i].Mbr_First_Name;
                  var CONSISTENT_MEMBER_ID= resultedcondjson[i].CONSISTENT_MEMBER_ID;
                  var BCBSRI_ID= resultedcondjson[i].BCBSRI_ID;
                  var Mbr_DOB= resultedcondjson[i].Mbr_DOB;
                  var BCBSRI_Risk_Categorization= resultedcondjson[i].BCBSRI_Risk_Categorization;
                  var New_PCMH_HR_Flag= resultedcondjson[i].New_PCMH_HR_Flag;
                  var RUB= resultedcondjson[i].RUB;
                  var Medicare_Risk_Index= resultedcondjson[i].Medicare_Risk_Index;
                  var Hypertension= resultedcondjson[i].Hypertension;
                  var Hyperlipid= resultedcondjson[i].Hyperlipid;
                  var LowBackPain= resultedcondjson[i].LowBackPain;
                  var Diabetes= resultedcondjson[i].Diabetes;
                  var IschemicHD= resultedcondjson[i].IschemicHD;
                  var Asthma= resultedcondjson[i].Asthma;
                  var COPD= resultedcondjson[i].COPD;
                  var CHF= resultedcondjson[i].CHF;
                  var Cancer= resultedcondjson[i].Cancer;
                  var Depression= resultedcondjson[i].Depression;
                  var ESRD= resultedcondjson[i].ESRD;
                  var CKD= resultedcondjson[i].CKD;
                  var Hospice_Flag= resultedcondjson[i].Hospice_Flag;
                  var BH_Risk_Category= resultedcondjson[i].BH_Risk_Category;
                  var Adv_Dir_S0257= resultedcondjson[i].Adv_Dir_S0257;
                  var for_month= req.body.for_month;
                  var for_year= req.body.for_year;
                  var monthname= req.body.monthname;
                  var inserted_by= req.body.userid;
                  var pcmh_id= pcmhid;


                  // query to the database and get the records
                  request.query("INSERT into conditionsandrisk_data_tbl(uploadedfileid,Mbr_Last_Name,Mbr_First_Name,CONSISTENT_MEMBER_ID,BCBSRI_ID,Mbr_DOB,BCBSRI_Risk_Categorization,New_PCMH_HR_Flag,RUB,Medicare_Risk_Index,Hypertension,Hyperlipid,LowBackPain,Diabetes,IschemicHD,Asthma,COPD,CHF,Cancer,Depression,ESRD,CKD,Hospice_Flag,BH_Risk_Category,Adv_Dir_S0257,for_month,for_year,inserted_by,pcmh_id,monthname) VALUES ('"+uploadedfileid+"', '"+Mbr_Last_Name+"', '"+Mbr_First_Name+"', '"+CONSISTENT_MEMBER_ID+"', '"+BCBSRI_ID+"', '"+Mbr_DOB+"', '"+BCBSRI_Risk_Categorization+"', '"+New_PCMH_HR_Flag+"', '"+RUB+"', '"+Medicare_Risk_Index+"', '"+Hypertension+"', '"+Hyperlipid+"', '"+LowBackPain+"', '"+Diabetes+"', '"+IschemicHD+"', '"+Asthma+"', '"+COPD+"', '"+CHF+"', '"+Cancer+"', '"+Depression+"', '"+ESRD+"', '"+CKD+"', '"+Hospice_Flag+"', '"+BH_Risk_Category+"', '"+Adv_Dir_S0257+"', '"+for_month+"', '"+for_year+"', '"+inserted_by+"', '"+pcmhid+"', '"+monthname+"');", function (err, recordset) {
                      
                    if (err) {
                        reject(error)
                        console.log(err)
                    }

                      // send records as a response
                      resolve(recordset)
                    //   res.send(recordset);
                      
                  });
              }

          }
          var resultedcostjson=req.body.costandutilization;
          if(resultedcostjson.length>0)
          {
              
              for (var i=0;i<resultedcostjson.length;i++)
              {
                  var uploadedfileid= lastinsertedid;
                  var Mbr_Last_Name= resultedcostjson[i].Mbr_Last_Name;
                  var Mbr_First_Name= resultedcostjson[i].Mbr_First_Name;
                  var CONSISTENT_MEMBER_ID= resultedcostjson[i].CONSISTENT_MEMBER_ID;
                  var BCBSRI_ID= resultedcostjson[i].BCBSRI_ID;
                  var Mbr_DOB= resultedcostjson[i].Mbr_DOB;
                  var BCBSRI_Risk_Categorization= resultedcostjson[i].BCBSRI_Risk_Categorization;
                  var Probability_of_IP_in_6mos= resultedcostjson[i].Probability_of_IP_in_6mos;
                  var IP_Medical_Cnt= resultedcostjson[i].IP_Medical_Cnt;
                  var OP_ER_Cnt= resultedcostjson[i].OP_ER_Cnt;
                  var Total_Cost= resultedcostjson[i].Total_Cost;
                  var Medical_Cost= resultedcostjson[i].Medical_Cost;
                  var Rx_Cost= resultedcostjson[i].Rx_Cost;
                  var High_Cost_50k= resultedcostjson[i].High_Cost_50k;
                  var High_Cost_Driver= resultedcostjson[i].High_Cost_Driver;
                  var RxSpecialty_Drug= resultedcostjson[i].RxSpecialty_Drug;
                  var RxSpecialty_Disease_Desc= resultedcostjson[i].RxSpecialty_Disease_Desc;
                  var for_month= req.body.for_month;
                  var for_year= req.body.for_year;
                  var monthname= req.body.monthname;
                  var inserted_by= req.body.userid;
                  var pcmh_id= pcmhid;


                  // query to the database and get the records
                  request.query("INSERT into costandutilization_data_tbl(uploadedfileid,Mbr_Last_Name,Mbr_First_Name,CONSISTENT_MEMBER_ID,BCBSRI_ID,Mbr_DOB,BCBSRI_Risk_Categorization,Probability_of_IP_in_6mos,IP_Medical_Cnt,OP_ER_Cnt,Total_Cost,Medical_Cost,Rx_Cost,High_Cost_50k,High_Cost_Driver,RxSpecialty_Drug,RxSpecialty_Disease_Desc,for_month,for_year,inserted_by,pcmh_id,monthname) VALUES ('"+uploadedfileid+"', '"+Mbr_Last_Name+"', '"+Mbr_First_Name+"', '"+CONSISTENT_MEMBER_ID+"', '"+BCBSRI_ID+"', '"+Mbr_DOB+"', '"+BCBSRI_Risk_Categorization+"', '"+Probability_of_IP_in_6mos+"', '"+IP_Medical_Cnt+"', '"+OP_ER_Cnt+"', '"+Total_Cost+"', '"+Medical_Cost+"', '"+Rx_Cost+"', '"+High_Cost_50k+"', '"+High_Cost_Driver+"', '"+RxSpecialty_Drug+"', '"+RxSpecialty_Disease_Desc+"', '"+for_month+"', '"+for_year+"', '"+inserted_by+"', '"+pcmhid+"', '"+monthname+"');", function (err, recordset) {
                      
                    if (err) {
                        reject(error)
                        console.log(err)
                    }

                      // send records as a response
                      resolve(recordset)
                    //   res.send(recordset);
                      
                  });
              }

          }
          var resultedbcbsrijson=req.body.bcbsriprogram;
          if(resultedbcbsrijson.length>0)
          {
              
              for (var i=0;i<resultedbcbsrijson.length;i++)
              {
                  var uploadedfileid= lastinsertedid;
                  var Mbr_Last_Name= resultedbcbsrijson[i].Mbr_Last_Name;
                  var Mbr_First_Name= resultedbcbsrijson[i].Mbr_First_Name;
                  var CONSISTENT_MEMBER_ID= resultedbcbsrijson[i].CONSISTENT_MEMBER_ID;
                  var BCBSRI_ID= resultedbcbsrijson[i].BCBSRI_ID;
                  var Mbr_DOB= resultedbcbsrijson[i].Mbr_DOB;
                  var BCBSRI_Risk_Categorization= resultedbcbsrijson[i].BCBSRI_Risk_Categorization;
                  var In_Home_Assessment_Status= resultedbcbsrijson[i].In_Home_Assessment_Status;
                  var In_Home_Assessment_Status_date= resultedbcbsrijson[i].In_Home_Assessment_Status_date;
                  var BH_CM_Flag= resultedbcbsrijson[i].BH_CM_Flag;
                  var BH_CM_Discharge_Dt= resultedbcbsrijson[i].BH_CM_Discharge_Dt;
                  var BH_CM_Discharge_Reason= resultedbcbsrijson[i].BH_CM_Discharge_Reason;
                  var HCBB_Eligible= resultedbcbsrijson[i].HCBB_Eligible;
                  var HCBB_Engaged= resultedbcbsrijson[i].HCBB_Engaged;
                  var for_month= req.body.for_month;
                  var for_year= req.body.for_year;
                  var monthname= req.body.monthname;
                  var inserted_by= req.body.userid;
                  var pcmh_id= pcmhid;


                  // query to the database and get the records
                  request.query("INSERT into bcbsriprogram_data_tbl(uploadedfileid,Mbr_Last_Name,Mbr_First_Name,CONSISTENT_MEMBER_ID,BCBSRI_ID,Mbr_DOB,BCBSRI_Risk_Categorization,In_Home_Assessment_Status,In_Home_Assessment_Status_date,BH_CM_Flag,BH_CM_Discharge_Dt,BH_CM_Discharge_Reason,HCBB_Eligible,HCBB_Engaged,for_month,for_year,inserted_by,pcmh_id,monthname) VALUES ( '"+uploadedfileid+"', '"+Mbr_Last_Name+"', '"+Mbr_First_Name+"', '"+CONSISTENT_MEMBER_ID+"', '"+BCBSRI_ID+"', '"+Mbr_DOB+"', '"+BCBSRI_Risk_Categorization+"', '"+In_Home_Assessment_Status+"', '"+In_Home_Assessment_Status_date+"', '"+BH_CM_Flag+"', '"+BH_CM_Discharge_Dt+"', '"+BH_CM_Discharge_Reason+"', '"+HCBB_Eligible+"', '"+HCBB_Engaged+"', '"+for_month+"', '"+for_year+"', '"+inserted_by+"', '"+pcmhid+"', '"+monthname+"');", function (err, recordset) {
                      
                    if (err) {
                        reject(error)
                        console.log(err)
                    }

                      // send records as a response
                      resolve(recordset)
                    //   res.send(recordset);
                      
                  });
              }

          }
          var resultedpatientjson=req.body.patientalldata;
           if(resultedpatientjson.length>0)
          {
              
              for (var i=0;i<resultedpatientjson.length;i++)
              {
                  var uploadedfileid= lastinsertedid;
                  var BCBSRI_Risk_Categorization= resultedpatientjson[i].BCBSRI_Risk_Categorization;
                  var Prospective_Risk_Score= resultedpatientjson[i].Prospective_Risk_Score;
                  var RUB= resultedpatientjson[i].RUB;
                  var Adv_Dir_S0257= resultedpatientjson[i].Adv_Dir_S0257;
                  var Asthma= resultedpatientjson[i].Asthma;
                  var BCBSRI_ID= resultedpatientjson[i].BCBSRI_ID;
                  var BH_CM_Discharge_Date= resultedpatientjson[i].BH_CM_Discharge_Date;
                  var BH_CM_Discharge_Reason= resultedpatientjson[i].BH_CM_Discharge_Reason;
                  var BH_CM_Enrollment= resultedpatientjson[i].BH_CM_Enrollment;
                  var BH_Risk_Category= resultedpatientjson[i].BH_Risk_Category;
                  var Cancer= resultedpatientjson[i].Cancer;
                  var CHF= resultedpatientjson[i].CHF;
                  var CKD= resultedpatientjson[i].CKD;
                  var CONSISTENT_MEMBER_ID= resultedpatientjson[i].CONSISTENT_MEMBER_ID;
                  var contracted_group_name= resultedpatientjson[i].contracted_group_name;
                  var COPD= resultedpatientjson[i].COPD;
                  var Date_Attributed_to_PCP= resultedpatientjson[i].Date_Attributed_to_PCP;
                  var Depression= resultedpatientjson[i].Depression;
                  var Diabetes= resultedpatientjson[i].Diabetes;
                  var ESRD= resultedpatientjson[i].ESRD;
                  var HCBB_Eligible= resultedpatientjson[i].HCBB_Eligible;
                  var HCBB_Engaged= resultedpatientjson[i].HCBB_Engaged;
                  var High_Cost_50K= resultedpatientjson[i].High_Cost_50K;
                  var High_Cost_Driver= resultedpatientjson[i].High_Cost_Driver;
                  var Hospice= resultedpatientjson[i].Hospice;
                  var Hyperlipid= resultedpatientjson[i].Hyperlipid;
                  var Hypertension= resultedpatientjson[i].Hypertension;
                  var In_Home_Assessment_Status= resultedpatientjson[i].In_Home_Assessment_Status;
                  var In_Home_Assessment_Status_Date= resultedpatientjson[i].In_Home_Assessment_Status_Date;
                  var IschemicHD= resultedpatientjson[i].IschemicHD;
                  var LowBackPain= resultedpatientjson[i].LowBackPain;
                  var Mbr_Addr1= resultedpatientjson[i].Mbr_Addr1;
                  var Mbr_Addr2= resultedpatientjson[i].Mbr_Addr2;
                  var Mbr_Age= resultedpatientjson[i].Mbr_Age;
                  var Mbr_City= resultedpatientjson[i].Mbr_City;
                  var Mbr_DOB= resultedpatientjson[i].Mbr_DOB;
                  var Mbr_First_Name= resultedpatientjson[i].Mbr_First_Name;
                  var Mbr_Gender= resultedpatientjson[i].Mbr_Gender;
                  var Mbr_Last_Name= resultedpatientjson[i].Mbr_Last_Name;
                  var Mbr_Phone_Nbr= resultedpatientjson[i].Mbr_Phone_Nbr;
                  var Mbr_State= resultedpatientjson[i].Mbr_State;
                  var Mbr_Zip= resultedpatientjson[i].Mbr_Zip;
                  var Medical_Cost= resultedpatientjson[i].Medical_Cost;
                  var Medicare_Dual_Coverage_Type= resultedpatientjson[i].Medicare_Dual_Coverage_Type;
                  var Medicare_ID= resultedpatientjson[i].Medicare_ID;
                  var Medicare_Risk_Index= resultedpatientjson[i].Medicare_Risk_Index;
                  var IP_Medical_Cnt= resultedpatientjson[i].IP_Medical_Cnt;
                  var New_PCMH_HR_Flag= resultedpatientjson[i].New_PCMH_HR_Flag;
                  var OP_ER_Cnt= resultedpatientjson[i].OP_ER_Cnt;
                  var PCP_First_name= resultedpatientjson[i].PCP_First_name;
                  var PCP_Last_Name= resultedpatientjson[i].PCP_Last_Name;
                  var Perf_Guarantee_Mbr= resultedpatientjson[i].Perf_Guarantee_Mbr;
                  var Pharmacy_Cost= resultedpatientjson[i].Pharmacy_Cost;
                  var Practice_Site= resultedpatientjson[i].Practice_Site;
                  var Probability_of_IP_in_6mos= resultedpatientjson[i].Probability_of_IP_in_6mos;
                  var Product= resultedpatientjson[i].Product;
                  var Requires_PCP_Referral= resultedpatientjson[i].Requires_PCP_Referral;
                  var RxSpecialty_Disease_Desc= resultedpatientjson[i].RxSpecialty_Disease_Desc;
                  var RxSpecialty_Drug= resultedpatientjson[i].RxSpecialty_Drug;
                  var Total_Cost= resultedpatientjson[i].Total_Cost;
                //   var status = resultedpatientjson[i].status;    
                  var insrted_by= req.body.userid;
                  var updated_by= '1';
                //   var report_date= resultedpatientjson[i].report_date;
                  var pcmh_id= pcmhid;
                  var for_month= req.body.for_month;
                  var for_year= req.body.for_year;
                  var monthname= req.body.monthname;


                  // query to the database and get the records
                  request.query("INSERT into patientalldata_tbl(uploadedfileid,BCBSRI_Risk_Categorization,Prospective_Risk_Score,RUB,Adv_Dir_S0257,Asthma,BCBSRI_ID,BH_CM_Discharge_Date,BH_CM_Discharge_Reason,BH_CM_Enrollment,BH_Risk_Category,Cancer,CHF,CKD,CONSISTENT_MEMBER_ID,contracted_group_name,COPD,Date_Attributed_to_PCP,Depression,Diabetes,ESRD,HCBB_Eligible,HCBB_Engaged,High_Cost_50K,High_Cost_Driver,Hospice,Hyperlipid,Hypertension,In_Home_Assessment_Status,In_Home_Assessment_Status_Date,IschemicHD,LowBackPain,Mbr_Addr1,Mbr_Addr2,Mbr_Age,Mbr_City,Mbr_DOB,Mbr_First_Name,Mbr_Gender,Mbr_Last_Name,Mbr_Phone_Nbr,Mbr_State,Mbr_Zip,Medical_Cost,Medicare_Dual_Coverage_Type,Medicare_ID,Medicare_Risk_Index,IP_Medical_Cnt,New_PCMH_HR_Flag,OP_ER_Cnt,PCP_First_name,PCP_Last_Name,Perf_Guarantee_Mbr,Pharmacy_Cost,Practice_Site,Probability_of_IP_in_6mos,Product,Requires_PCP_Referral,RxSpecialty_Disease_Desc,RxSpecialty_Drug,Total_Cost,insrted_by,updated_by,pcmh_id,for_month,for_year,monthname) VALUES ('"+uploadedfileid+"', '"+BCBSRI_Risk_Categorization+"', '"+Prospective_Risk_Score+"', '"+RUB+"', '"+Adv_Dir_S0257+"', '"+Asthma+"', '"+BCBSRI_ID+"', '"+BH_CM_Discharge_Date+"', '"+BH_CM_Discharge_Reason+"', '"+BH_CM_Enrollment+"', '"+BH_Risk_Category+"', '"+Cancer+"', '"+CHF+"', '"+CKD+"', '"+CONSISTENT_MEMBER_ID+"', '"+contracted_group_name+"', '"+COPD+"', '"+Date_Attributed_to_PCP+"', '"+Depression+"', '"+Diabetes+"', '"+ESRD+"', '"+HCBB_Eligible+"', '"+HCBB_Engaged+"', '"+High_Cost_50K+"', '"+High_Cost_Driver+"', '"+Hospice+"', '"+Hyperlipid+"', '"+Hypertension+"', '"+In_Home_Assessment_Status+"', '"+In_Home_Assessment_Status_Date+"', '"+IschemicHD+"', '"+LowBackPain+"', '"+Mbr_Addr1+"', '"+Mbr_Addr2+"', '"+Mbr_Age+"', '"+Mbr_City+"', '"+Mbr_DOB+"', '"+Mbr_First_Name+"', '"+Mbr_Gender+"', '"+Mbr_Last_Name+"', '"+Mbr_Phone_Nbr+"', '"+Mbr_State+"', '"+Mbr_Zip+"', '"+Medical_Cost+"', '"+Medicare_Dual_Coverage_Type+"', '"+Medicare_ID+"', '"+Medicare_Risk_Index+"', '"+IP_Medical_Cnt+"', '"+New_PCMH_HR_Flag+"', '"+OP_ER_Cnt+"', '"+PCP_First_name+"', '"+PCP_Last_Name+"', '"+Perf_Guarantee_Mbr+"', '"+Pharmacy_Cost+"', '"+Practice_Site+"', '"+Probability_of_IP_in_6mos+"', '"+Product+"', '"+Requires_PCP_Referral+"', '"+RxSpecialty_Disease_Desc+"', '"+RxSpecialty_Drug+"', '"+Total_Cost+"', '"+insrted_by+"', '"+updated_by+"', '"+pcmh_id+"', '"+for_month+"', '"+for_year+"', '"+monthname+"');", function (err, recordset) {
                      
                    if (err) {
                        reject(error)
                        console.log(err)
                    }

                      // send records as a response
                      resolve(recordset)
                    //   res.send(recordset);
                      
                  });
              }

          }
          var resultedreturnjson=req.body.returnreport;
           if(resultedreturnjson.length>0)
          {
              
              for (var i=0;i<resultedreturnjson.length;i++)
              {
                  var uploadedfileid= lastinsertedid;
                  var Mbr_Last_Name= resultedreturnjson[i].Mbr_Last_Name;
                  var Mbr_First_Name= resultedreturnjson[i].Mbr_First_Name;
                  var BCBSRI_ID= resultedreturnjson[i].BCBSRI_ID;
                  var Mbr_DOB= resultedreturnjson[i].Mbr_DOB;
                  var BCBSRI_Risk_Categorization= resultedreturnjson[i].BCBSRI_Risk_Categorization;
                  var Perf_Guarantee_Mbr= resultedreturnjson[i].Perf_Guarantee_Mbr;
                  var Practice_Site= resultedreturnjson[i].Practice_Site;
                  var Practice_Identified_Indicator= resultedreturnjson[i].Practice_Identified_Indicator;
                  var Outreach_Attempted_Date= "";
                  var Enrolled_Status_Date= "";
                  var BH_Screening_PHQ2_PHQ9_Completed_Date= "";
                  var Care_Plan_Established_Date= "";
                  var Discharged_from_CM_Date= "";
                  var Status= resultedreturnjson[i].Status;
                  var pcmh_id= pcmhid;
                  var for_month= req.body.for_month;
                  var for_year= req.body.for_year;
                  var monthname= req.body.monthname;
                  var inserted_by= req.body.userid;
                  var updated_by= 0;


                  // query to the database and get the records
                  request.query("INSERT into returnreport_data_tbl(uploadedfileid,Mbr_Last_Name,Mbr_First_Name,BCBSRI_ID,Mbr_DOB,BCBSRI_Risk_Categorization,Perf_Guarantee_Mbr,Practice_Site,Practice_Identified_Indicator,Outreach_Attempted_Date,Enrolled_Status_Date,BH_Screening_PHQ2_PHQ9_Completed_Date,Care_Plan_Established_Date,Discharged_from_CM_Date,Status,for_month,for_year,inserted_by,updated_by,pcmh_id,monthname) VALUES ('"+uploadedfileid+"', '"+Mbr_Last_Name+"', '"+Mbr_First_Name+"', '"+BCBSRI_ID+"', '"+Mbr_DOB+"', '"+BCBSRI_Risk_Categorization+"', '"+Perf_Guarantee_Mbr+"', '"+Practice_Site+"', '"+Practice_Identified_Indicator+"', '"+Outreach_Attempted_Date+"', '"+Enrolled_Status_Date+"', '"+BH_Screening_PHQ2_PHQ9_Completed_Date+"', '"+Care_Plan_Established_Date+"', '"+Discharged_from_CM_Date+"', '"+Status+"', '"+for_month+"', '"+for_year+"', '"+inserted_by+"', '"+updated_by+"', '"+pcmhid+"', '"+monthname+"');", function (err, recordset) {
                      
                    if (err) {
                        reject(error)
                        console.log(err)
                    }

                      // send records as a response
                      resolve(recordset)
                    //   res.send(recordset);
                      
                  });
              }

          }
        });
    }
    // context.res = {
    //     body: '4'
    // };
}