



const resError = (err, status, res) => {
    
    res.status(status).json({
        ok: false,
        err
    });

}


module.exports = {resError}