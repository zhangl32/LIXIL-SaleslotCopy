// For HubSpot API calls
const axios = require('axios');
const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN'],
  });
  
  // Deal ObjectTypeId
  const objectTypeDeal = "0-3";
  // SalesLot ObjectTypeId
  const objectTypeSalesLot = "2-18983127";
  // process Sales RecordId
  const {saleslotId} = context.parameters;
  // process Deal RecordId
  let dealRecordId = "";

  try {
    //-------------------------SalesLotのRecordIDで関連すべてDealのRecordIDを取得する -------------------------
    const BatchInputPublicObjectId = { inputs: [{"id":saleslotId}] };
    let apiResponse = await hubspotClient.crm.associations.batchApi.read(objectTypeSalesLot, objectTypeDeal, BatchInputPublicObjectId);
    if(apiResponse.results.length > 0 ){
      let associations = apiResponse.results[0]["to"];
      if(associations.length > 0){
        dealRecordId = associations[0].id;
      }
    }
    
    let dealstage = '';
    if(dealRecordId != ''){
      const dealProperties = ["dealstage"];
      let apiDealResponse = await hubspotClient.crm.deals.basicApi.getById(dealRecordId, dealProperties);
      dealstage =apiDealResponse.properties.dealstage;
    }

    if(dealstage=='75418032'){
      //DealがWinのため、SalesLotをコピーする
      await callWebhookEndpoint(saleslotId);
      return { status: 'success', meesage:"Workflow initiated successfully. Please wait for 4-5 minutes while the system completes the processing.  Thank you for your patience!" };
    }else{
      return { status: 'success', meesage:"Can not copy current saleslot because the deal stage is not [W : Contracted]." };
    }
    
  } catch (err) {
    return { status: 'error', message: err.message }
  }
};


const callWebhookEndpoint = async (saleslotId) => {
  return axios.post(
    `https://api-na1.hubapi.com/automation/v4/webhook-triggers/39703267/Fgue9nS`,
    {
        saleslotId: saleslotId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
