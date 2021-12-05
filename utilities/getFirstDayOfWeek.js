module.exports = () =>{
    let result = new Date();
    while(result.getDay() !== 0){
        result.setDate(result.getDate()-1);
    }
    return result.setUTCHours(0,0,0,0);
}