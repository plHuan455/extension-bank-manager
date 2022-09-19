class Program {
  #groupInput
  #contentInput
  #timeInput
  #colorInput
  #moneyInput
  #success
  #error
  #loading
  #btn

  constructor(groupInputSel, contentInputSel, timeInputSel, colorInputSel, moneyInputSel, successSel, errorSel, loadingSel, btnSel){
    this.#groupInput = document.querySelector(groupInputSel);
    this.#contentInput = document.querySelector(contentInputSel);
    this.#timeInput = document.querySelector(timeInputSel);
    this.#colorInput = document.querySelector(colorInputSel);
    this.#moneyInput = document.querySelector(moneyInputSel);
    this.#success = document.querySelector(successSel);
    this.#error = document.querySelector(errorSel);
    this.#btn = document.querySelector(btnSel);
    this.#loading = document.querySelector(loadingSel);
  }

  #init(){
    this.#resetMessage();
    this.#btn.addEventListener('click', ()=> {
      this.#handleBtnClick();
    })

    const now = new Date();
    this.#timeInput.value = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
    this.#groupInput.value = this.#getGroupFromLocalStorage() || '';
  }

  async #handleBtnClick(){
    try{
      this.#resetMessage();
      this.#setLoading(true);
      const data = { 
        groupId: this.#groupInput.value,
        content: this.#contentInput.value,
        time: this.#convertTime(this.#timeInput.value),
        color: this.#colorInput.value || this.#randomColor(),
        money: this.#moneyInput.value.replace(/(?<=\d+)k/g, '.000'),
      }
      chrome.runtime.sendMessage({type: "getBankResponse", payload: JSON.stringify(data)}, (response) => {
        this.#setSuccess(true);
      });
      
      this.#setLoading(false);
      this.#storeGroupId(this.#groupInput.value);
    }
    catch(err){
      this.#setError(true);
    }
  }

  #convertTime(timeStr) {
    try{
      const dateTime = timeStr.split(" ");
      const date = dateTime[0].split('/');
      const time = dateTime[1].split(':');
      return (new Date(date[2], date[1] - 1, date[0], time[0], time[1])).toString();
    }catch(err){
      throw err
    }
  }

  #randomColor(){
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }

  #storeGroupId(groupId){
    localStorage.setItem('bank-manager-groupId', groupId);
  }

  #getGroupFromLocalStorage(){
    return localStorage.getItem('bank-manager-groupId');
  }

  #setSuccess(flag){
    if(flag){
      this.#success.classList.remove('hide');
      return;
    }

    this.#success.classList.add('hide');
  }

  #setError(flag){
    if(flag){
      this.#error.classList.remove('hide');
      return;
    }

    this.#error.classList.add('hide');
  }

  #setLoading(flag){
    if(flag){
      this.#loading.classList.remove('hide');
      return;
    }
    this.#loading.classList.add('hide');
  }

  #resetMessage(){
    this.#setLoading(false);
    this.#setError(false);
    this.#setSuccess(false);
  }

  run(){
    this.#init();
  }
}