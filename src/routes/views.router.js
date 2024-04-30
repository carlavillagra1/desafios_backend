const { Router } = require("express")
const router = Router()

router.get('/realTimeProducts', (req, res) => {
    res.render("realTimeProducts", {})
})

module.exports = router;