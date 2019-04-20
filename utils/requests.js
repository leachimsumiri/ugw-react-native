
// Ruft URL ab, gibt bei Erfolg JSON-Daten und
// wirft im Fehlerfall Statuscode + Statustext
export async function fetchJson(url) {
    return fetch(url)
        //.then(checkStatus)
        .then((response) => Promise.all([
            response, 
            response.ok ? response.json() : response.text() ])) // falls 200 und kein JSON sollte .json() ggf auch einen Fehler werfen! (wobei eh unwahrscheinliche Kombo)
        .then(([response, data]) => {
            if (!response.ok) {
                let error = new Error("("+response.status+") " + data);
                error.response = response;
                throw error;
            }
            return data;
        })
        //.catch(e => e);
        ;
}

  // POST-Example
  /* 
  fetch('https://mywebsite.com/endpoint/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstParam: 'yourValue',
      secondParam: 'yourOtherValue',
    }),
  }); */
