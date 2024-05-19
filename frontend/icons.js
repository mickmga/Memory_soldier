window.onload = async () => {
    const response = await getLogos();
    console.log(response);
 }
  
 const getLogos = async () => {
    return fetch('http://localhost:3000/logos', {
       headers: { 
          'Content-Type': 'application/json'
       }
     }
   )
 } 
 
 