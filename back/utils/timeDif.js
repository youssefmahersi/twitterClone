function timeDiffCalc(dateFuture, dateNow) {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    // const days = Math.floor(diffInMilliSeconds / 86400);
    // diffInMilliSeconds -= days * 86400;
    // console.log('calculated days', days);

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) ;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    let difference = '';
    difference += hours+'.';
    
    difference += (minutes<10)? '0'+minutes : minutes; 

    return parseFloat(difference);
  }


  module.exports = timeDiffCalc;