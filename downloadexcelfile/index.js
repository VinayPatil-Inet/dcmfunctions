
const { BlobServiceClient } = require("@azure/storage-blob"); 
const fs = require('fs');
const AZURE_STORAGE_CONNECTION_STRING = process.env['AZURE_STORAGE_CONNECTION_STRING'];
// var blobService = BlobServiceClient.createBlobService();
// var containerName = 'uploadedexcelfiles';
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


//     var fileName = 'hello-world.xlsx';
// var blobName = 'dcm.xlsx';
// blobService.getBlobToFile(
//     containerName,
//     blobName,
//     fileName,
//     function(err, blob) {
//         if (err) {
//             console.error("Couldn't download blob %s", blobName);
//             console.error(err);
//         } else {
//             console.log("Sucessfully downloaded blob %s to %s", blobName, fileName);
//             fs.readFile(fileName, function(err, fileContents) {
//                 if (err) {
//                     console.error("Couldn't read file %s", fileName);
//                     console.error(err);
//                 } else {
//                     console.log(fileContents);
//                 }
//             });
//         }
//     });
    // var bodyBuffer=Buffer.from(req.body);

    // var boundary =multipart.getBoundary(req.headers['content-type']);

    // var parts =multipart.Parse(bodyBuffer,boundary);

    const blobserviceclient= BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=storageaccountdcm8caa;AccountKey=ro8UB4X4hFDcAmtKf2Q+hsV9i0YCvjzF0IYP7tvwFeUnzOsaWiaXMYtUEdPNtSAsaJDNYFGsJ2c+k2d6RkUTEw==;EndpointSuffix=core.windows.net');

    const container = "bcbsriuploadedfiles";
    
    const blobName = "dcm.xlsx";
    
    const containerClient =  blobserviceclient.getContainerClient(container);

    const blobClient = containerClient.getBlockBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = (
        await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    ).toString();
    console.log("Downloaded blob content:", downloaded);
   
    // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
    async function streamToBuffer(readableStream) {
        return new Promise((resolve, reject) => {
          const chunks = [];
          readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
          });
          readableStream.on("end", () => {
            resolve(Buffer.concat(chunks));
          });
          readableStream.on("error", reject);
        });
      }
    

//     // const uploadBlobResponse=  blockBlobClient.upload(parts[0].data,parts[0].data.length);

//     context.res= {body : {name:"blobName"}};

//     context.done();

}