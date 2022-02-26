const fs = require('fs')

function saveLine($data){
    
    // let save = $data.join('-')
    let save = `${JSON.stringify($data)}\n`;
    // let save = $data
    console.log(save)
    fs.appendFile('log.line',save,(err)=>{
        if(!err){
            console.log('The file has been saved!');
            return 'success';
        }
        return 'error'
    })

}

module.exports = saveLine;