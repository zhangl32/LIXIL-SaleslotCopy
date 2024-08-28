// For HubSpot API calls
const axios = require('axios');

exports.main = async (context = {}) => {
  const { saleslotId } = context.parameters;
  
  try {
    await callWebhookEndpoint(saleslotId1);
    return { status: 'success', meesage:"Workflow initiated successfully. Please wait for 4-5 minutes while the system completes the processing.  Thank you for your patience!" };
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
