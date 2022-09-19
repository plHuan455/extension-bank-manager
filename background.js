const createBankManage = async (data) => {
  const response = await fetch('https://teamwork-tc.herokuapp.com/api/extension/bank-manager', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });

  return response;
}


chrome.runtime.onMessage.addListener((action, sender, sendResponse) => {
  console.log(action);
  if (action.type === 'getBankResponse') {
    createBankManage(action.payload).then((res) => { 
      sendResponse(res)
    }).then((error) => { 
      console.log(error);
    });
  }
  return true;
});