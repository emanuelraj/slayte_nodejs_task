//npm install request and request-promise
const requestPromise = require('request-promise');

const REMOTE_RESOURCE_1_URL = 'http://example.com/api/resource1';
const REMOTE_RESOURCE_2_URL = 'http://example.com/api/resource2';
     
class Controller {
	_attemptUpdateRemoteAPI (url, data, method) {
        return new Promise((resolve, reject) => {
            let retries = 0;
            const callingRequest = () => {
                //request options
                var options = {
					method: method,
					uri: url,
					formData: data
				};

				requestPromise(options)
				.then(resolve)
				.catch((error) => {
					if(retries < 3) {//retries each call for 3 times if failed
						retries ++;
						return callingRequest();
                    }
                    //rejects if failed for the 4th time
					reject(error)
				});
            };
            callingRequest();
        })
    };
	
    static updateRemoteApi () {
        this._attemptUpdateRemoteAPI(REMOTE_RESOURCE_1_URL, { value: 'new1' }, 'put') //Updating Resource1 with the new value
            .then(() => this._attemptUpdateRemoteAPI(REMOTE_RESOURCE_2_URL, { value: 'new2' }, 'put') //If success Updating Resource2 with the new value
                .catch((e) => this._attemptUpdateRemoteAPI(REMOTE_RESOURCE_1_URL, { value: 'old1' }, 'put'))) //If failed Updating Resource1 with the previous value
            .catch(e => console.log(e))
    }
}
