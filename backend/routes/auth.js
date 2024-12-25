const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    obj = {
        a:"ISHAN",
        n: 9
    }
    res.json(obj)
})

module.exports = router