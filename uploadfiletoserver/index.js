module.exports = async function (context, req) {
  const { DefaultAzureCredential } = require("@azure/identity");
  const { SecretClient } = require("@azure/keyvault-secrets");
  const { BlobServiceClient } = require('@azure/storage-blob');
  var multipart=require("parse-multipart");
  // const keyVaultName = "keysofsanchit";
  // const KVUri = "https://" + keyVaultName + ".vault.azure.net";

  // const credential = new DefaultAzureCredential();
  // const client = new SecretClient(KVUri, credential);

  // const retrievedSecret = await client.getSecret("ConnString");
  // const ConnString = retrievedSecret.value;
  /*context.log("username =", ConnString);
  context.res = {
    body: ConnString,
  };*/  

  console.log("start");
  var bodyBuffer=Buffer.from(req.body);

    var boundary =multipart.getBoundary(req.headers['content-type']);

    var parts =multipart.Parse(bodyBuffer,boundary);
  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString('DefaultEndpointsProtocol=https;AccountName=storageaccountdcm8caa;AccountKey=ro8UB4X4hFDcAmtKf2Q+hsV9i0YCvjzF0IYP7tvwFeUnzOsaWiaXMYtUEdPNtSAsaJDNYFGsJ2c+k2d6RkUTEw==;EndpointSuffix=core.windows.net');

  // Create a unique name for the container
  const containerName = 'bcbsriuploadedfiles';
  
  console.log('\nCreating container...');
  console.log('\t', containerName);
  

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  
      // Create a unique name for the blob
  // const blobName = 'pkwwww' + '.txt';

  var blobName = parts[0].filename;
//  var res1 = parts[0].filename;
  // var res = res1.split(".");
  // var todaydate = new Date();
  // var datetimeinmili = Date.parse(todaydate);
  // var resultedname= res[0]+"-"+datetimeinmili+"."+res[1];
  // const blobName = resultedname;
  
  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
  console.log('\nUploading to Azure storage as blob:\n\t', blobName);
  
  // Upload data to the blob
  //const data = 'Hello, World!';
  // const uploadBlobResponse=  blockBlobClient.upload(parts[0].data,parts[0].data.length);
  const uploadBlobResponse = await blockBlobClient.upload(parts[0].data,parts[0].data.length);
  console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
  context.res = {
      body: blobName,
  };


};