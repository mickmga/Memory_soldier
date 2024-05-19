window.onload = async (): Promise<void> => {
   //console.log("making the first api call!");
   const response = await getLogos();
   console.log(response);
}


const getLogos = async (): Promise<any> => {
    console.log("getting logos");
   return fetch('https://api.iconfinder.com/v4/icons/search?query=arrow&count=10', {
      headers: { 
         Authorization: 'Bearer uOYEohnWqwtTPG4s6dkh8MNUlQYCpgqzA4O6hJmpcXcVJk4D7ogC7chxdN0hgSlH'
      }
    }
  )
} 

